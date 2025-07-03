from pathlib import Path

import pytest

from doc81.core.config import LocalConfig, ServerConfig
from doc81.core.exception import Doc81NotAllowedError, Doc81ServiceException
from doc81.service.get_template import get_template
from doc81.service.list_templates import list_templates
from tests.utils import override_env


def test_list_templates():
    with override_env(
        DOC81_MODE="local",
        DOC81_PROMPT_DIR=str(Path(__file__).parent / "data/pass"),
    ):
        test_config = LocalConfig()
        templates = list_templates(test_config)
    assert len(templates) > 0
    assert any("runbook.template.md" in template for template in templates)


def test_list_templates_raise_error_in_server_mode():
    with override_env(DOC81_MODE="server"):
        test_config = ServerConfig()
        with pytest.raises(Doc81NotAllowedError):
            list_templates(test_config)


def test_get_template_from_url():
    with pytest.raises(Doc81ServiceException):
        get_template("https://example.com/template.md", LocalConfig(mode="local"))


def test_get_template_from_path_raise_error_if_name_is_not_in_frontmatter():
    with override_env(
        DOC81_MODE="local",
        DOC81_PROMPT_DIR=str(Path(__file__).parent / "data"),
    ):
        config = LocalConfig()
        with pytest.raises(Doc81ServiceException) as e:
            get_template(
                str(
                    Path(__file__).parent / "data" / "fail" / "runbook.non-template.md"
                ),
                config,
            )

        assert "Template name is required" in str(e.value)


def test_get_template_from_path_raise_error_if_description_are_not_in_frontmatter():
    with override_env(
        DOC81_MODE="local",
        DOC81_PROMPT_DIR=str(Path(__file__).parent / "data"),
    ):
        config = LocalConfig()
        with pytest.raises(Doc81ServiceException) as e:
            get_template(
                str(
                    Path(__file__).parent / "data" / "fail" / "runbook.non-template.md"
                ),
                config,
            )

        assert "Template description is required" in str(e.value)
