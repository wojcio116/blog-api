Feature: Writing blog articles (create, edit, delete)

  Background:
    Given I use seed data

  Scenario: As the author, I can create a new article with valid data and see it in the list
    Given I use admin token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "title": "Brand New Article",
        "text": "This is a brand new blog post written through the admin API."
      }
      """
    Then the response status should be 201
    And the response body should have the property "id"
    And the response body should have the property "publishedAt"
    And the response body property "title" should equal "Brand New Article"
    And the response body property "text" should equal "This is a brand new blog post written through the admin API."
    And I remember the response body
    Given I do not use a token
    When I send a "GET" request to "/api/v1/articles"
    Then the response status should be 200
    And the response body should contain 4 articles ordered newest first
    When I send a "GET" request to the created article
    Then the response status should be 200
    And the response body should match the remembered response body

  Scenario: As the author, creating an article with invalid data returns 400 with violations on each wrong field
    Given I use admin token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "title": "Hi",
        "text": "Short"
      }
      """
    Then the response status should be 400
    And the response body should have a violation on "title"
    And the response body should have a violation on "text"

  Scenario: As the author, editing an article with invalid data returns 400 with violations on each wrong field
    Given I use admin token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001" with body:
      """
      {
        "title": "",
        "text": "Tiny"
      }
      """
    Then the response status should be 400
    And the response body should have a violation on "title"
    And the response body should have a violation on "text"

  Scenario: As the author, creating an article with server-owned or unknown fields returns 400
    Given I use admin token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "id": "5e1f0a2b-9999-4000-8000-000000000055",
        "title": "Valid Title",
        "text": "Valid article text content for testing.",
        "publishedAt": "2020-01-01T00:00:00.000Z",
        "extraField": "not allowed"
      }
      """
    Then the response status should be 400
    And the response body should have a violation on "id"
    And the response body should have a violation on "publishedAt"
    And the response body should have a violation on "extraField"

  Scenario: As the author, editing an article with server-owned or unknown fields returns 400
    Given I use admin token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001" with body:
      """
      {
        "publishedAt": "2020-01-01T00:00:00.000Z",
        "unknownField": 123
      }
      """
    Then the response status should be 400
    And the response body should have a violation on "publishedAt"
    And the response body should have a violation on "unknownField"

  Scenario: As the author, editing an existing article saves changes and preserves publishedAt
    Given I use admin token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001" with body:
      """
      {
        "title": "Updated Clean NestJS API"
      }
      """
    Then the response status should be 200
    And the response body should contain:
      """
      {
        "id": "5e1f0a2b-0001-4000-8000-000000000001",
        "title": "Updated Clean NestJS API",
        "text": "In this article we explore layered architecture, CQRS, and PostgreSQL integration with Prisma 7.",
        "publishedAt": "2026-02-01T12:00:00.000Z"
      }
      """

  Scenario: As the author, editing a non-existent article ID returns 404
    Given I use admin token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-9999-4000-8000-000000000099" with body:
      """
      {
        "title": "Does Not Matter"
      }
      """
    Then the response status should be 404
    And the response body should contain a not found message

  Scenario: As the author, deleting a non-existent article ID returns 404
    Given I use admin token
    When I send a "DELETE" request to "/api/v1/articles/5e1f0a2b-9999-4000-8000-000000000099"
    Then the response status should be 404
    And the response body should contain a not found message

  Scenario: As the author, editing an invalid article ID returns 400
    Given I use admin token
    When I send a "PATCH" request to "/api/v1/articles/not-a-valid-uuid" with body:
      """
      {
        "title": "Does Not Matter"
      }
      """
    Then the response status should be 400

  Scenario: As the author, deleting an invalid article ID returns 400
    Given I use admin token
    When I send a "DELETE" request to "/api/v1/articles/not-a-valid-uuid"
    Then the response status should be 400

  Scenario: As the author, deleting an existing article succeeds and subsequent read returns 404
    Given I use admin token
    When I send a "DELETE" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001"
    Then the response status should be 204
    Given I do not use a token
    When I send a "GET" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001"
    Then the response status should be 404

  Scenario: Any write request without a token returns 401
    Given I do not use a token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "title": "Unauthorized Post",
        "text": "This request has no bearer token at all."
      }
      """
    Then the response status should be 401
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001" with body:
      """
      {
        "title": "Unauthorized Patch"
      }
      """
    Then the response status should be 401
    When I send a "DELETE" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001"
    Then the response status should be 401

  Scenario: Any write request with a wrong token returns 403
    Given I use a wrong token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "title": "Forbidden Post",
        "text": "This request has an invalid bearer token."
      }
      """
    Then the response status should be 403
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001" with body:
      """
      {
        "title": "Forbidden Patch"
      }
      """
    Then the response status should be 403
    When I send a "DELETE" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001"
    Then the response status should be 403

  Scenario: Write request without a token and with invalid data returns 401 instead of revealing validation rules
    Given I do not use a token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "title": "",
        "text": "",
        "unknownField": 123
      }
      """
    Then the response status should be 401
