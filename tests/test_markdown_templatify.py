from doc81.service.templatify import templatify


import textwrap

D = textwrap.dedent


# ---------------------------------------------------------------------------
# Helper predicates so we don’t hard-code exact numbers everywhere
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
# CASE 3 – Code block body becomes “[Code tsx 1]” while fence remains
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
# CASE 4 – Image token: alt text stays, src swapped for “[Image 1]”
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
