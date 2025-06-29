import pytest
from doc_81.service.list_templates import list_templates
from tests.utils import override_env


def test_list_templates():
    templates = list_templates()
    assert len(templates) > 0
    assert "incident_runbook.md" in templates


def test_list_templates_raise_error_in_server_mode():
    with override_env(DOC81_MODE="server"):
        with pytest.raises(NotImplementedError):
            list_templates()
