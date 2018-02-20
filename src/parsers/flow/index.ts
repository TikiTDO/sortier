import { createError, includeShebang } from "../../common/parser-utils";
import * as flowParser from "flow-parser";

export function parse(text: string /*, parsers, opts*/) {
    const ast = flowParser.parse(text, {
        esproposal_class_instance_fields: true,
        esproposal_class_static_fields: true,
        esproposal_export_star_as: true
    });

    if (ast.errors.length > 0) {
        const loc = ast.errors[0].loc;
        throw createError(ast.errors[0].message, {
            start: { line: loc.start.line, column: loc.start.column + 1 },
            end: { line: loc.end.line, column: loc.end.column + 1 }
        });
    }

    includeShebang(text, ast);
    return ast;
}