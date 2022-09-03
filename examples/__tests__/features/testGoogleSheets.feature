# https://docs.google.com/spreadsheets/d/1ILKwKeRaOEh7_uAVIyfDVqUPbEdCNIlAaOEFY-zdMzU/edit#gid=0
Feature: Test Google Sheets test generation using Bitloops

  Scenario Template: Valid arithmetic calculations
    Given I have the calculation string <calculationString>
    When I calculate the result
    Then I should see the result <output>

  Scenario Template: Invalid arithmetic calculations
    Given I have the calculation string <calculationString>
    Then I should receive an error <output>

