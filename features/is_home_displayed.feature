Feature: Is homepage displayed?
  Ensure the basic homepage of the game is displayed

  Scenario: Does the homepage show the credit ?
    Given I go to the page "http://localhost:3000/"
    When I do nothing
    Then I should see the homepage with the copyright "© 2001 - Julien Leroy" at the footer

  Scenario: Does the homepage test fail if not?
    Given I go to the page "http://localhost:3000/"
    When I do nothing
    Then I shouldn't see the homepage with the copyright "©loubi" at the footer

