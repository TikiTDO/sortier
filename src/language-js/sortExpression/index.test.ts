import { expect } from "chai";
import { runTestAssestsTests } from "../../utilities/test-utils";
import { parse as typescriptParse } from "../parsers/typescript";
import { getParser } from "../utilities/test-utils";
// The methods being tested here
import { sortExpression } from "./index";

describe("language-js/sortExpression", () => {
  runTestAssestsTests(
    __dirname,
    (inputFilePath: string, inputFileContents: string) => {
      const parser = getParser(inputFilePath);
      let parsed = parser(inputFileContents);
      let actual = sortExpression(
        parsed.body[0].declarations[0].init,
        parsed.comments,
        inputFileContents,
        {}
      );
      return actual;
    }
  );

  it("Respects a custom order", () => {
    let input = `let example = 1 | null | undefined`;
    let expected = `let example = null | undefined | 1`;
    let parsed = typescriptParse(input);
    let actual = sortExpression(
      parsed.body[0].declarations[0].init,
      parsed.comments,
      input,
      {
        groups: ["null", "undefined"],
      }
    );

    expect(actual).to.equal(expected);
  });

  it("Sets the order if groups is missing from options", () => {
    let input = `let example = 1 | null | undefined`;
    let expected = `let example = undefined | null | 1`;
    let parsed = typescriptParse(input);
    let actual = sortExpression(
      parsed.body[0].declarations[0].init,
      parsed.comments,
      input,
      {
        groups: undefined,
      }
    );

    expect(actual).to.equal(expected);
  });
});
