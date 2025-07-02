import json
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from doc81.core.exception import Doc81ServiceException
from doc81.core.schema import Doc81Template
from doc81.rest.app import app
from tests.utils import override_env

client = TestClient(app)


@pytest.fixture
def mock_template():
    return Doc81Template(
        name="Test Template",
        description="A test template",
        tags=["test", "example"],
        path="/path/to/template.md",
    )


@pytest.fixture
def mock_templates():
    return [
        Doc81Template(
            name="Template 1",
            description="First test template",
            tags=["test"],
            path="/path/to/template1.md",
        ),
        Doc81Template(
            name="Template 2",
            description="Second test template",
            tags=["example"],
            path="/path/to/template2.md",
        ),
    ]


class TestTemplatesEndpoints:
    """Tests for template management endpoints"""

    def test_list_templates(self, mock_templates):
        """Test GET /templates endpoint"""
        with patch("doc81.service.list_templates") as mock_list:
            # Setup mock
            mock_list.return_value = [
                template.model_dump() for template in mock_templates
            ]

            # Execute request
            response = client.get("/templates")

            # Verify
            assert response.status_code == 200
            templates = response.json()
            assert len(templates) == 2
            assert templates[0]["name"] == "Template 1"
            assert templates[1]["name"] == "Template 2"
            mock_list.assert_called_once()

    def test_list_templates_empty(self):
        """Test GET /templates when no templates exist"""
        with patch("doc81.service.list_templates") as mock_list:
            # Setup mock
            mock_list.return_value = []

            # Execute request
            response = client.get("/templates")

            # Verify
            assert response.status_code == 200
            templates = response.json()
            assert len(templates) == 0
            mock_list.assert_called_once()

    def test_list_templates_error(self):
        """Test GET /templates with server error"""
        with patch("doc81.service.list_templates") as mock_list:
            # Setup mock
            mock_list.side_effect = Doc81ServiceException("Failed to list templates")

            # Execute request
            response = client.get("/templates")

            # Verify
            assert response.status_code == 500
            error = response.json()
            assert "error" in error
            assert "Failed to list templates" in error["error"]

    def test_create_template(self):
        """Test POST /templates endpoint"""
        template_data = {
            "name": "New Template",
            "description": "A new template",
            "tags": ["new", "test"],
            "content": "# New Template\n\nThis is a new template.",
        }

        with patch("doc81.rest.routes.templates.create_template") as mock_create:
            # Setup mock
            mock_create.return_value = {
                "name": "New Template",
                "description": "A new template",
                "tags": ["new", "test"],
                "path": "/path/to/new_template.md",
            }

            # Execute request
            response = client.post("/templates", json=template_data)

            # Verify
            assert response.status_code == 201
            created_template = response.json()
            assert created_template["name"] == "New Template"
            assert created_template["description"] == "A new template"
            mock_create.assert_called_once_with(template_data)

    def test_create_template_invalid_data(self):
        """Test POST /templates with invalid data"""
        # Missing required fields
        template_data = {"name": "Invalid Template"}

        response = client.post("/templates", json=template_data)

        # Verify
        assert response.status_code == 422
        error = response.json()
        assert "detail" in error

    def test_update_template(self, mock_template):
        """Test PATCH /templates/{template_id} endpoint"""
        template_id = "template-123"
        update_data = {"name": "Updated Template", "description": "Updated description"}

        with patch("doc81.rest.routes.templates.update_template") as mock_update:
            # Setup mock
            updated_template = mock_template.model_copy()
            updated_template.name = "Updated Template"
            updated_template.description = "Updated description"
            mock_update.return_value = updated_template.model_dump()

            # Execute request
            response = client.patch(f"/templates/{template_id}", json=update_data)

            # Verify
            assert response.status_code == 200
            template = response.json()
            assert template["name"] == "Updated Template"
            assert template["description"] == "Updated description"
            mock_update.assert_called_once_with(template_id, update_data)

    def test_update_template_not_found(self):
        """Test PATCH /templates/{template_id} with non-existent template"""
        template_id = "non-existent"
        update_data = {"name": "Updated Template"}

        with patch("doc81.rest.routes.templates.update_template") as mock_update:
            # Setup mock
            mock_update.side_effect = Doc81ServiceException("Template not found")

            # Execute request
            response = client.patch(f"/templates/{template_id}", json=update_data)

            # Verify
            assert response.status_code == 404
            error = response.json()
            assert "error" in error
            assert "Template not found" in error["error"]

    def test_delete_template(self):
        """Test DELETE /templates endpoint"""
        template_id = "template-to-delete"

        with patch("doc81.rest.routes.templates.delete_template") as mock_delete:
            # Setup mock
            mock_delete.return_value = {
                "status": "success",
                "message": "Template deleted",
            }

            # Execute request
            response = client.delete(f"/templates/{template_id}")

            # Verify
            assert response.status_code == 200
            result = response.json()
            assert result["status"] == "success"
            mock_delete.assert_called_once_with(template_id)

    def test_delete_template_not_found(self):
        """Test DELETE /templates with non-existent template"""
        template_id = "non-existent"

        with patch("doc81.rest.routes.templates.delete_template") as mock_delete:
            # Setup mock
            mock_delete.side_effect = Doc81ServiceException("Template not found")

            # Execute request
            response = client.delete(f"/templates/{template_id}")

            # Verify
            assert response.status_code == 404
            error = response.json()
            assert "error" in error
            assert "Template not found" in error["error"]


class TestUserTemplatesEndpoints:
    """Tests for user-specific template endpoints"""

    def test_get_user_templates(self, mock_templates):
        """Test GET /users/{user_id}/templates endpoint"""
        user_id = "user-123"

        with patch("doc81.rest.routes.users.get_user_templates") as mock_get:
            # Setup mock
            mock_get.return_value = [
                template.model_dump() for template in mock_templates
            ]

            # Execute request
            response = client.get(f"/users/{user_id}/templates")

            # Verify
            assert response.status_code == 200
            templates = response.json()
            assert len(templates) == 2
            assert templates[0]["name"] == "Template 1"
            assert templates[1]["name"] == "Template 2"
            mock_get.assert_called_once_with(user_id)

    def test_get_user_templates_empty(self):
        """Test GET /users/{user_id}/templates when user has no templates"""
        user_id = "user-with-no-templates"

        with patch("doc81.rest.routes.users.get_user_templates") as mock_get:
            # Setup mock
            mock_get.return_value = []

            # Execute request
            response = client.get(f"/users/{user_id}/templates")

            # Verify
            assert response.status_code == 200
            templates = response.json()
            assert len(templates) == 0
            mock_get.assert_called_once_with(user_id)

    def test_get_user_templates_user_not_found(self):
        """Test GET /users/{user_id}/templates with non-existent user"""
        user_id = "non-existent-user"

        with patch("doc81.rest.routes.users.get_user_templates") as mock_get:
            # Setup mock
            mock_get.side_effect = Doc81ServiceException("User not found")

            # Execute request
            response = client.get(f"/users/{user_id}/templates")

            # Verify
            assert response.status_code == 404
            error = response.json()
            assert "error" in error
            assert "User not found" in error["error"]


class TestTemplateDetailsEndpoints:
    """Tests for template details endpoints"""

    def test_get_template(self, mock_template):
        """Test GET /templates/{template_id} endpoint"""
        template_id = "template-123"

        with patch("doc81.service.get_template") as mock_get:
            # Setup mock
            mock_get.return_value = mock_template.model_dump()

            # Execute request
            response = client.get(f"/templates/{template_id}")

            # Verify
            assert response.status_code == 200
            template = response.json()
            assert template["name"] == "Test Template"
            assert template["description"] == "A test template"
            assert "test" in template["tags"]
            mock_get.assert_called_once_with(template_id)

    def test_get_template_not_found(self):
        """Test GET /templates/{template_id} with non-existent template"""
        template_id = "non-existent"

        with patch("doc81.service.get_template") as mock_get:
            # Setup mock
            mock_get.side_effect = Doc81ServiceException("Template not found")

            # Execute request
            response = client.get(f"/templates/{template_id}")

            # Verify
            assert response.status_code == 404
            error = response.json()
            assert "error" in error
            assert "Template not found" in error["error"]


class TestTemplateGenerationEndpoints:
    """Tests for template generation endpoints"""

    def test_generate_template(self):
        """Test POST /templates/generate endpoint"""
        generate_data = {
            "raw_markdown": "# Test Document\n\nThis is a test document.",
            "model": "openai/gpt-4o-mini",
        }

        with patch("doc81.service.generate_template") as mock_generate:
            # Setup mock
            mock_generate.return_value = "---\nname: Generated Template\ndescription: Auto-generated template\ntags: [generated]\n---\n\n# {{title}}\n\nThis is a {{description}}."

            # Execute request
            response = client.post("/templates/generate", json=generate_data)

            # Verify
            assert response.status_code == 200
            result = response.json()
            assert "template" in result
            assert "---" in result["template"]
            assert "{{title}}" in result["template"]
            mock_generate.assert_called_once_with(
                generate_data["raw_markdown"], model=generate_data["model"]
            )

    def test_generate_template_invalid_model(self):
        """Test POST /templates/generate with invalid model"""
        generate_data = {
            "raw_markdown": "# Test Document\n\nThis is a test document.",
            "model": "invalid-model",
        }

        response = client.post("/templates/generate", json=generate_data)

        # Verify
        assert response.status_code == 422
        error = response.json()
        assert "detail" in error

    def test_generate_template_empty_markdown(self):
        """Test POST /templates/generate with empty markdown"""
        generate_data = {"raw_markdown": "", "model": "openai/gpt-4o-mini"}

        response = client.post("/templates/generate", json=generate_data)

        # Verify
        assert response.status_code == 422
        error = response.json()
        assert "detail" in error

    def test_generate_template_service_error(self):
        """Test POST /templates/generate with service error"""
        generate_data = {
            "raw_markdown": "# Test Document\n\nThis is a test document.",
            "model": "openai/gpt-4o-mini",
        }

        with patch("doc81.service.generate_template") as mock_generate:
            # Setup mock
            mock_generate.side_effect = Exception("Generation failed")

            # Execute request
            response = client.post("/templates/generate", json=generate_data)

            # Verify
            assert response.status_code == 500
            error = response.json()
            assert "error" in error
            assert "Generation failed" in error["error"]
