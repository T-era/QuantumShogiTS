/// <reference path="rule/quantum_test.ts" />
/// <reference path="rule/qDecide_test.ts" />
/// <reference path="rule/reface_test.ts" />
/// <reference path="control/server_test.ts" />

module Test {
  export type func = (dom :HTMLElement) => void;
  export var all :func[];

  export class TestCase {
    table :HTMLElement;
    errors :HTMLElement;

    constructor(parent :HTMLElement, caseName :string) {
      var caseDiv = document.createElement('div');
      caseDiv.className = 'test_case';
      parent.appendChild(caseDiv);
      var input = document.createElement('input');
      input.type = 'checkbox'
      input.id = caseName;
      var label = document.createElement('label');
      label.htmlFor = caseName;
      label.textContent = caseName;
      this.errors = document.createElement('var');
      this.errors.className = 'test_errors'
      this.errors.textContent = '';
      caseDiv.appendChild(input);
      caseDiv.appendChild(label);
      caseDiv.appendChild(this.errors);
      var resultDiv = document.createElement('div');
      resultDiv.className = 'result_detail';
      caseDiv.appendChild(resultDiv);
      this.table = document.createElement('table');
      resultDiv.appendChild(this.table);
    }

    show(caption :string, actual, expect, comparator=null) {
      if (comparator == null) {
        comparator = function(a, b) { return a == b; };
      }
      var result = comparator(actual, expect);
      var tr = document.createElement('tr');
      this.table.appendChild(tr);
      var th = document.createElement('th');
      th.textContent = caption;
      tr.appendChild(th);
      var td = document.createElement('td');
      td.textContent = result;
      tr.appendChild(td);
      if (! result) {
        this.errors.textContent += 'X';
        console.log(caption, actual);
      }
    }
  }
  export function CompareAsJSON(a, b) {
    return JSON.stringify(a) == JSON.stringify(b);
  }

  var output = document.getElementById('output');
  [
    Test.RuleTest.all,
    Test.RuleTest.QDecideTest.all,
    Test.RuleTest.RefaceTest.all,
    Test.ControlTest.all
  ].forEach(function(all) {
    all.forEach(function(test) {
      test(output);
    });
  });

}
