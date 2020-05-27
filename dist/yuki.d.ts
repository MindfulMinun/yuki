/**
 * @typedef YukiToken Describes a token
 * @prop {
    | "identifier"
    | "comment"
    | "newline"
    | "whitespace"
    | "jump"
    | "string"
    | "number"
    | "literal"
 } type The type of value this token represents
 * @prop {string} content The string content of this token
 * @prop {string | number} [value] The value of this token, used for numbers and string literals
 */
/** Parses a Yuki script */
export default class Yuki {
    /** Reserved words. These can't be the name of an identifier */
    static get KEYWORDS(): string[];
    /** RegExps */
    static get Re(): {
        /** Grabs an identifier */
        identifier: RegExp;
        /** Grabs a line */
        line: RegExp;
        /**
         * Grabs things inside double quotes.
         * `match[0]` matches the string, quotes included.
         * `match[1]` matches the contents, without quotes.
         */
        doubleQuotes: RegExp;
        /** Grabs a comment block, delimited by #* and *# */
        commentBlock: RegExp;
        /** Grabs an inline comment, which starts with # and ends at the end of the line */
        commentLine: RegExp;
        /** Matches a number, optionally with a decimal point */
        number: RegExp;
        /** Matches whitespace */
        whitespace: RegExp;
    };
    /**
     * @param {string} script The script to parse
     */
    constructor(script: string);
    isParsed: boolean;
    flags: {};
    chapters: {};
    /**
     * The lexed tokens
     * @type {YukiToken[]}
     */
    tokens: YukiToken[];
    /** The script exactly as it was passed to the Yuki constructor. */
    rawScript: string;
    /** The part of the script we're currently parsing */
    chunk: string;
    /** Tokenizes the Yuki-formatted script for parsing */
    tokenizeScript(): void;
    _tokenIdentifier(): number;
    _tokenComment(): number;
    _tokenWhitespace(): number;
    _tokenJump(): number;
    _tokenString(): number;
    _tokenNumber(): number;
    _tokenLiteral(): number;
}
/**
 * Describes a token
 */
export type YukiToken = {
    /**
     * The type of value this token represents
     */
    type: "identifier" | "comment" | "newline" | "whitespace" | "jump" | "string" | "number" | "literal";
    /**
     * The string content of this token
     */
    content: string;
    /**
     * The value of this token, used for numbers and string literals
     */
    value?: string | number;
};
