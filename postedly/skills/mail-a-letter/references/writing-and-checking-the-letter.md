# Writing the letter and checking the PDF before upload

Postedly prints exactly the file it receives. It does not turn notes or instructions into a letter. When the user asks you to write and mail a letter, the finished letter is your job before any upload.

## 1. Collect the facts

Ask for anything the letter needs that you do not know: names, dates, amounts, account or reference numbers, what the user is asking for, any deadline, and how they want to sign off. Never invent a fact, a quote, a legal citation or a signature. If the user wants a signature, they must supply an image of it or sign a printed copy themselves; do not fake one.

## 2. Write the actual letter

- Write the complete wording the recipient should read: date, recipient block, greeting, body, closing and the sender's typed name.
- Show the full text to the user and get an explicit OK (or edits) before exporting.
- No placeholders such as "[Your name]" or "Insert amount here" in the final text.
- No "sample", "draft" or "example" watermarks unless the user wants them.
- Keep Postedly branding and any tool or AI instructions out of the letter.
- A request form, consent form or outline is a different document from the letter it asks for. A welcome letter must contain the welcome message.

## 3. Export a real PDF

Use whatever PDF export is available in your environment (for example a document tool, a word processor export, or a PDF library in Claude Code). Requirements:

- Portrait US Letter, 8.5 x 11 inches, every page.
- Unencrypted, no password, at most 10 MiB.
- Reasonable margins (at least 0.5 inch, 1 inch is safer) so nothing is cut off.
- Postedly adds its own address page, so the letter does not need to fit a window envelope. Still include the recipient block in the letter itself if the user wants a normal business-letter look.
- Keep it within the six-sheet limit including the added address sheet. Most letters are one or two pages.

Save it with a clear, final file name (for example `deposit-request-final.pdf`) and use that exact file for upload.

## 4. Render and inspect every page

Before upload, render each page to an image and look at it. In Claude Code, for example:

```bash
pdfinfo deposit-request-final.pdf            # page count and page size (612 x 792 pts = US Letter)
pdftoppm -r 80 -png deposit-request-final.pdf page   # page-1.png, page-2.png, ...
```

Then open each image and check:

- The text is the approved wording, complete, with no placeholders.
- Page size is US Letter portrait (612 x 792 points).
- Nothing is clipped at the margins, no overlapping text, no blank trailing page.
- Names, addresses, dates and amounts match what the user told you.

If you cannot render pages in your environment, tell the user and ask them to open the PDF and confirm every page before you upload.

## 5. After the quote

The quote returns the final print proof (`document`) with the added address page. Check it too, and remind the user to review every page on the Postedly review page before approving. If anything is wrong, fix the source, export again, upload again and request a new quote. A quote cannot be edited.

## Example: user brings a word-processing file

User: "Mail my cover letter (cover-letter.docx) to Acme HR."

Export the .docx to PDF without changing the wording, render and inspect each page, confirm with the user that it is the final version, then upload the PDF. Do not "improve" the letter unless they ask.
