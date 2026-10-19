# Handwritten cards: catalog, styles and character limits

## Reading `postedly_products`

Call with `{"service": "handwritten"}` (the only accepted value). Each product has:

| Field | Use |
| --- | --- |
| `id` | Pass as `options.productId`, as a string of digits |
| `name`, `description` | Show to the user |
| `imageUrl` | Card design image. Share the link so the user can look |
| `available` | Only `true` cards can be ordered |
| `options.handwritingStyles` | List of `{id, label, imageUrl}`. Pass the exact `label` as `options.fontLabel` |
| `options.maxMessageLength` | Maximum message characters for this card |
| `options.maxWishesLength` | Maximum closing characters |
| `options.combinedCharacterLimit` | Maximum for message plus closing together |
| `options.previewKind` | `design_and_style_samples`: the catalog images are the card design and a style sample, not the finished message |

The catalog changes. Never reuse a card ID or style label from memory or from an earlier conversation; read it fresh. Example values seen in the public catalog (for orientation only): cards such as "Just A Note", "Sophisticated Thank You", "Happy Birthday Tiered Cake", "Simple Script", "With Sympathy White Flowers" and "Classy Congratulations", each with dozens of styles and limits of 500 message, 200 closing, 500 combined.

## Presenting choices

- Show cards as a short list: name, one-line description, image link.
- For styles, show a handful of labels with their sample image links rather than the full list, and offer to show more.
- Match the card to the occasion (thanks, birthday, sympathy, congratulations, general note), but let the user choose.

## Counting characters

The server counts `message.length + wishes.length` on the raw strings:

- Every space, punctuation mark and line break counts as one character.
- No separator is added between message and closing, and nothing is trimmed.
- The total must be at most `combinedCharacterLimit` (never above 1000). Each part must also fit its own maximum.

Example with limits 500 / 200 / 500:

| Message length | Closing length | Combined | OK? |
| --- | --- | --- | --- |
| 180 | 18 | 198 | Yes |
| 490 | 18 | 508 | No, over combined limit. Shorten the message by at least 8 characters |
| 510 | 0 | 510 | No, over the message limit |

When you are close to the limit, tell the user the exact count and suggest specific cuts. Do not silently shorten their words.

## Writing tips for real pen

- Short paragraphs read better in handwriting. A line break is fine but counts as a character.
- Avoid emoji and special symbols; plain text only.
- No signature codes, QR codes, template fields like `{first_name}`, or links that need to be clicked.
- Put the sign-off in `wishes` (for example "Warmly, Sam") rather than at the end of the message, so it is placed as a closing.

## The quote snapshot

`quote.handwritten` holds `cardId`, `cardName`, `cardImageUrl`, `fontId`, `fontLabel`, `fontImageUrl`, `message`, `wishes`, `sender`, `recipient`, `stampOptionId`, `stampName`. It is immutable. Read it back to the user word for word. Changing anything means a new quote.

The private review page can show a provider-rendered preview of the exact message in the chosen handwriting. Tell the user to look at it (and use its retry control if the image does not load) before approving. The finished card may vary from the preview.

## Privacy note for the user

Sender and recipient postal details go to Postedly and its handwriting partner to produce and mail the card. Postedly says email and phone are not sent to the handwriting provider.
