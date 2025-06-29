from pathlib import Path
import pytest
from doc_81.core.config import LocalConfig, ServerConfig
from doc_81.core.exception import Doc81ServiceException
from doc_81.service.get_template import get_template
from doc_81.service.list_templates import list_templates
from tests.utils import override_env


def test_list_templates():
    with override_env(
        DOC81_MODE="local",
        DOC81_PROMPT_DIR=str(Path(__file__).parent / "data/pass"),
    ):
        test_config = LocalConfig()
        templates = list_templates(test_config)
    assert len(templates) > 0
    assert "runbook.template.md" in [template["path"] for template in templates][0]


def test_list_templates_raise_error_in_server_mode():
    with override_env(DOC81_MODE="server"):
        test_config = ServerConfig()
        with pytest.raises(NotImplementedError):
            list_templates(test_config)


def test_get_template_from_url():
    with pytest.raises(Doc81ServiceException):
        get_template("https://example.com/template.md", LocalConfig())


def test_get_template_from_path_raise_error_if_name_is_not_in_frontmatter():
    with override_env(
        DOC81_MODE="local",
        DOC81_PROMPT_DIR=str(Path(__file__).parent / "data"),
    ):
        test_config = LocalConfig()
        with pytest.raises(Doc81ServiceException) as e:
            get_template(
                str(Path(__file__).parent / "data" / "fail" / "runbook.non-template.md")
            )

        assert "Template name is required" in str(e.value)


def test_get_template_from_path_raise_error_if_description_are_not_in_frontmatter():
    with override_env(
        DOC81_MODE="local",
        DOC81_PROMPT_DIR=str(Path(__file__).parent / "data"),
    ):
        with pytest.raises(Doc81ServiceException) as e:
            get_template(
                str(Path(__file__).parent / "data" / "fail" / "runbook.non-template.md")
            )

        assert "Template description is required" in str(e.value)
