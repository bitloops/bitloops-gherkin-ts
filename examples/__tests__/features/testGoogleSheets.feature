# https://docs.google.com/spreadsheets/d/1ILKwKeRaOEh7_uAVIyfDVqUPbEdCNIlAaOEFY-zdMzU/edit#gid=0
Feature: Test Google Sheets test generation using Bitloops

  Scenario Template: Valid arithmetic calculations
    Given I have the calculation string <calculationString>
    When I calculate the result
    Then I should see the result <output>

   # Examples: # @bitloops-auto-generated
       # | calculationString | output | @bitloops-auto-generated |
       # | 3 + 3 | 6 | @bitloops-auto-generated |
       # | 2 * 7 | 14 | @bitloops-auto-generated |
       # | 3 + 5 * 8 | 43 | @bitloops-auto-generated |
       # | 1 + 1  + 2 | 4 | @bitloops-auto-generated |
  
    Examples: # @bitloops-auto-generated
        | calculationString | output | @bitloops-auto-generated |
        | 51,32,43,32,51 | 54 | @bitloops-auto-generated |
        | 50,32,42,32,55 | 49,52 | @bitloops-auto-generated |
        | 51,32,43,32,53,32,42,32,56 | 52,51 | @bitloops-auto-generated |
        | 49,32,43,32,49,32,10,43,32,50 | 52 | @bitloops-auto-generated |
  
  Scenario Template: Invalid arithmetic calculations
    Given I have the calculation string <calculationString>
    Then I should receive an error <output>

   # Examples: # @bitloops-auto-generated
       # | calculationString | output | @bitloops-auto-generated |
       # | 3 + hello | hello is not defined | @bitloops-auto-generated |
       # | 2 * world | world is not defined | @bitloops-auto-generated |
  
    Examples: # @bitloops-auto-generated
        | calculationString | output | @bitloops-auto-generated |
        | 51,32,43,32,104,101,108,108,111 | 104,101,108,108,111,32,105,115,32,110,111,116,32,100,101,102,105,110,101,100 | @bitloops-auto-generated |
        | 50,32,42,32,119,111,114,108,100 | 119,111,114,108,100,32,105,115,32,110,111,116,32,100,101,102,105,110,101,100 | @bitloops-auto-generated |
  