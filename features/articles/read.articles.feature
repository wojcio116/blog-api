Feature: Reading blog articles

  Background:
    Given I use seed data

  Scenario: As a visitor, I can list all articles ordered newest first
    When I send a "GET" request to "/api/v1/articles"
    Then the response status should be 200
    And the response body should contain 3 articles ordered newest first

  Scenario: As a visitor, I receive articles published at the same moment in the same order on every call
    When I send a "GET" request to "/api/v1/articles"
    Then the response status should be 200
    And I remember the response body
    When I send a "GET" request to "/api/v1/articles"
    Then the response status should be 200
    And the response body should match the remembered response body

  Scenario: As a visitor, I receive an empty list when there are no articles
    Given the database has no articles
    When I send a "GET" request to "/api/v1/articles"
    Then the response status should be 200
    And the response body should be an empty list

  Scenario: As a visitor, I can retrieve a single existing article by its ID
    When I send a "GET" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001"
    Then the response status should be 200
    And the response body should contain:
      """
      {
        "id": "5e1f0a2b-0001-4000-8000-000000000001",
        "title": "Building a Clean NestJS API",
        "text": "In this article we explore layered architecture, CQRS, and PostgreSQL integration with Prisma 7.",
        "publishedAt": "2026-02-01T12:00:00.000Z"
      }
      """

  Scenario: As a visitor, I receive a 404 error with a message when requesting a non-existent article ID
    When I send a "GET" request to "/api/v1/articles/5e1f0a2b-9999-4000-8000-000000000099"
    Then the response status should be 404
    And the response body should contain a not found message

  Scenario: As a visitor, I receive a 400 error when requesting an article with an invalid ID
    When I send a "GET" request to "/api/v1/articles/not-a-valid-uuid"
    Then the response status should be 400

  Scenario: As an operator, running the seed multiple times does not duplicate articles
    When I run the database seed again
    And I run the database seed again
    And I send a "GET" request to "/api/v1/articles"
    Then the response status should be 200
    And the response body should contain 3 articles ordered newest first
