# Making postcard artwork that passes the quote check

Always start from the live `documentRequirements` on the `postcard` entry of `postedly_services`. Example values seen in the public catalog (check, do not assume):

| Field | Example value |
| --- | --- |
| `pageCount` | 2 (page 1 front, page 2 back) |
| `orientation` | landscape |
| `finishedSizeInches` | 6 x 4 |
| `artworkSizeInches` | 6.25 x 4.25 (finished size plus bleed) |
| `bleedInches` | 0.125 on every edge |
| `templateUrl` | a PDF guideline showing the safe area and the address and barcode zone |

If the live values differ, use the live values.

## Build the PDF

1. Make each page exactly the artwork size (for 6.25 x 4.25 in, that is 450 x 306 points).
2. Extend backgrounds and photos all the way to the page edge (into the bleed). The outer bleed is trimmed off.
3. Keep all text and important details inside the safe area shown on the template, well away from the trim line.
4. On the back, leave the address and barcode area completely blank. Postedly places the recipient and return address there. Put the message on the other side of the back.
5. Use readable type (at least about 9 pt) and enough contrast to print well.
6. Export as one unencrypted two-page PDF, front first, at most 10 MiB. Embed fonts.

`templateUrl` points to a guideline PDF hosted by Postedly's print partner. Give the link to the user if they want to design against it themselves. You do not need to fetch it: follow the layout above and use the quote's final proof to confirm placement.

## Check before upload

Render both pages (in Claude Code, for example `pdfinfo postcard.pdf` and `pdftoppm -r 100 -png postcard.pdf side`) and look at each image:

- Two pages, landscape, exact artwork size.
- Front first, back second.
- No text in the bleed or near the trim edge.
- The address and barcode area on the back is empty.
- No placeholder text, no "sample" marks, no Postedly branding.
- The message is exactly what the user approved, spelled correctly.

## After the quote

The final proof shows the postal address placed on the back. If the design collides with the address block or anything looks clipped, fix the artwork, upload again and request a new quote. A quote cannot be edited.

## Common errors

| Problem | Fix |
| --- | --- |
| Quote rejects page count | The PDF must have exactly the required pages. Remove extra pages or add the missing back |
| Quote rejects size or orientation | Resize each page to the live `artworkSizeInches`, landscape |
| User only has a photo | Make the photo the front, design a back with the message, and get the user's OK |
| User only has a message | Ask whether they want a simple text or image front, or suggest a handwritten card instead |
