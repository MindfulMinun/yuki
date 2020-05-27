# Yuki

A Yuki script should always begin with the literal `Yuki` followed by a string.

```yuki
Yuki "0.1.0"
```


## Comments

Inline comments start with a hash (`#`) and go on to the end of the line. Block comments start with a hash followed by an asterisk (`#*`) and end with `*#`.

```yuki
Yuki "0.1.0"

# I'm an inline comment!

#*
 * I'm a multiline comment!
 *#
```

## Defining chapters

You can declare chapters with the `define` keyword followed by the name of a chapter [(must follow identifier naming)](#Identifiers).

```yuki
Yuki "0.1.0"

define chapter_1:
    # I'm a chapter with no content.
```

## Options

You can use the `select` and `option` keywords to present a set of choices to the player, similar to Ren'Py's `menu` statement. 

```yuki
Yuki "0.1.0"

define my_select:
    select: "What do you want to do?"
        option: "Say hi"
            > 0 "Hellooo!"
        option: "Recursion"
            @my_select
```

## Jumps
Use `@` followed by a chapter identifier to denote a jump to that chapter.

```yuki
Yuki "0.1.0"

define intro:
    > 0 "It's chilly, I should go inside"
    @chapter_1

define chapter_1:
    > 0 "I sit by the fireplace to warm up."
```



## Identifiers

Identifiers *must* start with a letter or underscore, but afterwards can include letters, numbers, hyphens, and underscores. [See the RegExp at src/yuki.js:L82:25](/src/yuki.js#L82:25)
