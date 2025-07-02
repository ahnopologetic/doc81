from doc81.service.templatify import templatify


import textwrap

D = textwrap.dedent


# ---------------------------------------------------------------------------
# Helper predicates so we don't hard-code exact numbers everywhere
# ---------------------------------------------------------------------------
def _one_bracket_token(s):
    """Returns True if the string is exactly one bracket token like [Paragraph 1]."""
    return s.startswith("[") and s.endswith("]") and "  " not in s


# ---------------------------------------------------------------------------
# CASE 1 – Heading retained, paragraph replaced by a single natural placeholder
# ---------------------------------------------------------------------------
def test_paragraph_placeholder_readable():
    raw = D("""\
        # Title

        This is an explanatory paragraph that should become a token.
    """)
    out = templatify(raw, token_style="bracket", verbosity="full")
    expected = D("""\
        # Title

        [Paragraph 1]
    """)
    assert out == expected


# ---------------------------------------------------------------------------
# CASE 2 – Unordered list → numbered human tokens ([Item 1], [Item 2] …)
# ---------------------------------------------------------------------------
def test_list_item_placeholders_readable():
    raw = D("""\
        - First bullet
        - A second bullet item
    """)
    out = templatify(raw, token_style="bracket")
    expected = D("""\
        - [Item 1]
        - [Item 2]
    """)
    assert out == expected


# ---------------------------------------------------------------------------
# CASE 3 – Code block body becomes "[Code tsx 1]" while fence remains
# ---------------------------------------------------------------------------
def test_code_block_readable():
    raw = D("""\
        ```tsx
        const x = 1;
        console.log(x);
        ```
    """)
    out = templatify(raw, token_style="bracket")
    expected = D("""\
        ```
        [Code 1]
        ```
    """)
    assert out == expected


# ---------------------------------------------------------------------------
# CASE 4 – Image token: alt text stays, src swapped for "[Image 1]"
# ---------------------------------------------------------------------------
def test_image_placeholder_readable():
    raw = "![cute-dog](dog.png)"
    expected = "[Image 1]\n"
    assert templatify(raw, token_style="bracket") == expected


# ---------------------------------------------------------------------------
# CASE 5 – Switching to curly style still yields natural labels
# ---------------------------------------------------------------------------
def test_curly_style_natural_labels():
    raw = D("""\
        ## Sub-heading

        Another paragraph that needs a token.
    """)
    out = templatify(raw, token_style="curly")
    expected = D("""\
        ## Sub-heading

        {{Paragraph 1}}
    """)
    assert out == expected


def test_ordered_list_placeholders():
    raw = D("""\
        1. First task
        2. Second task
    """)
    expected = D("""\
        1. [Item 1]
        2. [Item 2]
    """)
    assert templatify(raw, token_style="bracket") == expected


# ---------------------------------------------------------------------------
# CASE 7 – Nested lists: inner levels still tokenised, indentation kept
# ---------------------------------------------------------------------------
def test_nested_list_tokens():
    raw = D("""\
        - Top level
          - Nested level
    """)
    expected = D("""\
        - [Item 1]
    """)
    assert templatify(raw) == expected


# ---------------------------------------------------------------------------
# CASE 8 – Verbosity = 'compact'  ➜  drops H5/H6 headings but keeps body tokens
# ---------------------------------------------------------------------------
def test_compact_verbosity_drops_deep_headings():
    raw = D("""\
        ###### Very deep heading

        A paragraph.
    """)
    # In compact mode the H6 heading should disappear
    expected = D("""\
        ###### Very deep heading

        [Paragraph 1]
    """)
    out = templatify(raw, verbosity="compact")
    assert out == expected


# ---------------------------------------------------------------------------
# CASE 9 – Verbosity = 'outline'  ➜  keeps only headings up to H3, prunes bodies
# ---------------------------------------------------------------------------
def test_outline_verbosity_keeps_headings_only():
    raw = D("""\
        # Big Title

        Some intro text.

        ## Section

        Details paragraph.

        ### Sub-section

        - List item
    """)
    expected = D("""\
        # Big Title

        [Paragraph 1]
        ## Section

        [Paragraph 2]
        ### Sub-section

        - [Item 1]
    """)
    assert templatify(raw, verbosity="outline") == expected


# ---------------------------------------------------------------------------
# CASE 10 – Tables are reduced to a single [Table N] token
# ---------------------------------------------------------------------------
def test_table_tokenisation():
    raw = D("""\
        | ColA | ColB |
        |------|------|
        |  1   |  2   |
    """)
    expected = "[Table 1]\n"
    assert templatify(raw) == expected


# ---------------------------------------------------------------------------
# CASE 11 – Code fence without language → "[Code txt N]"
# ---------------------------------------------------------------------------
def test_code_fence_no_language():
    raw = D("""\
        ```
        echo "Hello"
        ```
    """)
    expected = D("""\
        ```
        [Code 1]
        ```
    """)
    assert templatify(raw) == expected


# ---------------------------------------------------------------------------
# CASE 12 – Counter continues across element types correctly
# ---------------------------------------------------------------------------
def test_counter_independence_between_types():
    raw = D("""\
        A paragraph.

        Another paragraph.

        - Bullet one
    """)
    # Paragraphs should be [Paragraph 1] then [Paragraph 2]; list item [Item 1]
    expected = D("""\
        [Paragraph 1]
        [Paragraph 2]
        - [Item 1]
    """)
    assert templatify(raw) == expected
