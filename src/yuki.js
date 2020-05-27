// Yuki

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
    /**
     * @param {string} script The script to parse
     */
    constructor(script) {
        this.isParsed = false
        this.flags = {}
        this.chapters = {}

        /**
         * The lexed tokens
         * @type {YukiToken[]}
         */
        this.tokens = []

        /** The script exactly as it was passed to the Yuki constructor. */
        this.rawScript = script

        /** The part of the script we're currently parsing */
        this.chunk = ''

        this.tokenizeScript()
    }

    /** Tokenizes the Yuki-formatted script for parsing */
    tokenizeScript() {
        const script = this.rawScript

        /** The current position that the parser's reading */
        let i = 0

        while (this.chunk = script.slice(i)) {
            /** The number of characters that were parsed. */
            const consumed =
                this._tokenIdentifier() ||
                this._tokenComment()    ||
                this._tokenWhitespace() ||
                // this._tokenLine()       ||
                this._tokenJump() ||
                this._tokenString()     ||
                this._tokenNumber() ||
                // this._tokenJsx()        ||
                // this._tokenRegex()      ||
                // this._tokenJs()         ||
                this._tokenLiteral()

            i += consumed
        }

        this.isParsed = true
    }

    /** Reserved words. These can't be the name of an identifier */
    static get KEYWORDS() {
        return ['define', 'select', 'option', 'Yuki', 'eval']
    }

    /** RegExps */
    static get Re() {
        return {
            /** Grabs an identifier */
            identifier: /^([a-z\_][a-z0-9\-\_]*)/i,
            /** Grabs a line */
            line: /^([^\n]*)/,
            /**
             * Grabs things inside double quotes.  
             * `match[0]` matches the string, quotes included.  
             * `match[1]` matches the contents, without quotes.
             */
            doubleQuotes: /^"((?:[^"\\]|\\[\n\s\S])*)"/,
            /** Grabs a comment block, delimited by #* and *# */
            commentBlock: /^#\*[\n\s\S]*?\*#/,
            /** Grabs an inline comment, which starts with # and ends at the end of the line */
            commentLine: /^#[^\n]*(?:\n|$)/,
            /** Matches a number, optionally with a decimal point */
            number: /^\d*\.?\d+/,
            /** Matches whitespace */
            whitespace: /^[^\n\S]+/
        }
    }

    _tokenIdentifier() {
        const match = Yuki.Re.identifier.exec(this.chunk)
        if (!match) return 0
        this.tokens.push({
            type: 'identifier',
            content: match[0]
        })
        return match[0].length
    }
    _tokenComment() {
        let match = Yuki.Re.commentBlock.exec(this.chunk)
        if (!match) {
            match = Yuki.Re.commentLine.exec(this.chunk)
            if (!match) return 0
        }
        this.tokens.push({
            type: 'comment',
            content: match[0]
        })
        return match[0].length
    }
    _tokenWhitespace() {
        const match = Yuki.Re.whitespace.exec(this.chunk)
        const newline = this.chunk.charAt(0) === '\n'
        if (!match && !newline) return 0
        if (newline) {
            this.tokens.push({
                type: 'newline',
                content: '\n'
            })
            return 1
        }
        this.tokens.push({
            type: 'whitespace',
            content: match[0]
        })
        return match[0].length
    }
    _tokenJump() {
        // Tokenize jumps, which start with an @ and are followed by an identifier
        if (this.chunk.charAt(0) !== '@') return 0

        const match = Yuki.Re.identifier.exec(this.chunk.slice(1))
        if (!match) {
            throw Error('An @ token must by followed by an identifier to jump to.')
        }

        this.tokens.push({
            type: 'jump',
            content: '@' + match[0],
            value: match[0]
        })

        return match[0].length + 1
    }
    _tokenString() {
        const match = Yuki.Re.doubleQuotes.exec(this.chunk)
        if (!match) return 0
        this.tokens.push({
            type: 'string',
            content: match[0],
            value: match[1]
        })
        return match[0].length
    }
    _tokenNumber() {
        const match = Yuki.Re.number.exec(this.chunk)
        if (!match) return 0
        this.tokens.push({
            type: 'number',
            content: match[0],
            value: +match[0]
        })
        return match[0].length
    }
    _tokenLiteral() {
        this.tokens.push({
            type: 'literal',
            content: this.chunk.charAt(0)
        })
        return 1
    }
}
