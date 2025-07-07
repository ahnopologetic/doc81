import pytest
from fastapi.testclient import TestClient

from doc81.core.schema import Doc81Template
from doc81.rest.app import create_app
from tests.utils import override_env


# TODO: replace with a test config
@pytest.fixture
def client() -> TestClient:
    with override_env(DOC81_MODE="server"):
        return TestClient(create_app())


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

    def test_list_templates(self, client: TestClient):
        """Test GET /templates endpoint"""
        response = client.get("/templates")

        assert response.status_code == 200

    def test_list_templates_empty(self, client: TestClient):
        """Test GET /templates when no templates exist"""
        # Execute request
        response = client.get("/templates")

        # Verify
        assert response.status_code == 200
        templates = response.json()
        assert len(templates) == 0

    def test_create_template(self, client: TestClient):
        """Test POST /templates endpoint"""
        template_data = {
            "name": "New Template",
            "description": "A new template",
            "tags": ["new", "test"],
            "content": "# New Template\n\nThis is a new template.",
        }

        response = client.post("/templates", json=template_data)

        assert response.status_code == 201
        created_template = response.json()
        assert created_template["name"] == "New Template"
        assert created_template["description"] == "A new template"

    def test_create_template_invalid_data(self, client: TestClient):
        """Test POST /templates with invalid data"""
        template_data = {"name": "Invalid Template"}

        response = client.post("/templates", json=template_data)

        assert response.status_code == 422
        error = response.json()
        assert "detail" in error

    def test_update_template(self, client: TestClient):
        """Test PATCH /templates/{template_id} endpoint"""
        template_id = "template-123"
        update_data = {
            "name": "Updated Template",
            "description": "Updated description",
            "tags": ["updated", "test"],
            "content": "# Updated Template\n\nThis is an updated template.",
        }

        response = client.patch(f"/templates/{template_id}", json=update_data)

        assert response.status_code == 200
        template = response.json()
        assert template["name"] == "Updated Template"
        assert template["description"] == "Updated description"

    def test_update_template_not_found(self, client: TestClient):
        """Test PATCH /templates/{template_id} with non-existent template"""
        template_id = "non-existent"
        update_data = {"name": "Updated Template"}

        response = client.patch(f"/templates/{template_id}", json=update_data)

        assert response.status_code == 404
        error = response.json()
        assert "error" in error
        assert "Template not found" in error["error"]

    def test_delete_template(self, client: TestClient):
        """Test DELETE /templates endpoint"""
        template_id = "template-to-delete"

        response = client.delete(f"/templates/{template_id}")

        # Verify
        assert response.status_code == 204

    def test_delete_template_not_found(self, client: TestClient):
        """Test DELETE /templates with non-existent template"""
        template_id = "non-existent"

        response = client.delete(f"/templates/{template_id}")

        assert response.status_code == 404
        error = response.json()
        assert "error" in error
        assert "Template not found" in error["error"]


class TestUserTemplatesEndpoints:
    """Tests for user-specific template endpoints"""

    def test_get_user_templates(self, client: TestClient):
        """Test GET /users/{user_id}/templates endpoint"""
        user_id = "user-123"

        response = client.get(f"/users/{user_id}/templates")

        assert response.status_code == 200
        templates = response.json()
        assert len(templates) == 2
        assert templates[0]["name"] == "Template 1"
        assert templates[1]["name"] == "Template 2"

    def test_get_user_templates_empty(self, client: TestClient):
        """Test GET /users/{user_id}/templates when user has no templates"""
        user_id = "user-with-no-templates"

        response = client.get(f"/users/{user_id}/templates")

        assert response.status_code == 200
        templates = response.json()
        assert len(templates) == 0

    def test_get_user_templates_user_not_found(self, client: TestClient):
        """Test GET /users/{user_id}/templates with non-existent user"""
        user_id = "non-existent-user"

        response = client.get(f"/users/{user_id}/templates")

        assert response.status_code == 404
        error = response.json()
        assert "error" in error
        assert "User not found" in error["error"]


class TestTemplateDetailsEndpoints:
    """Tests for template details endpoints"""

    def test_get_template(self, client: TestClient):
        """Test GET /templates/{template_id} endpoint"""
        template_id = "template-123"

        response = client.get(f"/templates/{template_id}")

        assert response.status_code == 200
        template = response.json()
        assert template["name"] == "Test Template"
        assert template["description"] == "A test template"
        assert "test" in template["tags"]

    def test_get_template_not_found(self, client: TestClient):
        """Test GET /templates/{template_id} with non-existent template"""
        template_id = "non-existent"

        response = client.get(f"/templates/{template_id}/")

        assert response.status_code == 404
        error = response.json()
        assert "error" in error
        assert "Template not found" in error["error"]


class TestTemplateGenerationEndpoints:
    """Tests for template generation endpoints"""

    def test_generate_template(self, client: TestClient):
        """Test POST /templates/generate endpoint"""
        generate_data = {
            "raw_markdown": "# Test Document\n\nThis is a test document.",
            "model": "openai/gpt-4o-mini",
        }

        response = client.post("/templates/generate", json=generate_data)

        assert response.status_code == 200
        result = response.json()
        assert "template" in result
        assert "---" in result["template"]
        assert "{{title}}" in result["template"]

    def test_generate_template_invalid_model(self, client: TestClient):
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

    def test_generate_template_empty_markdown(self, client: TestClient):
        """Test POST /templates/generate with empty markdown"""
        generate_data = {"raw_markdown": "", "model": "openai/gpt-4o-mini"}

        response = client.post("/templates/generate", json=generate_data)

        # Verify
        assert response.status_code == 422
        error = response.json()
        assert "detail" in error

    def test_generate_template_service_error(self, client: TestClient):
        """Test POST /templates/generate with service error"""
        generate_data = {
            "raw_markdown": "# Test Document\n\nThis is a test document.",
            "model": "openai/gpt-4o-mini",
        }

        response = client.post("/templates/generate", json=generate_data)

        assert response.status_code == 500
        error = response.json()
        assert "error" in error
        assert "Generation failed" in error["error"]


class TestHealthEndpoints:
    """Tests for health endpoints"""

    def test_health(self, client: TestClient):
        """Test GET /health endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
