# Drift — New Tab

A flowing WebGL background, local clock, four moods and an address/search field.
The same page works as a static browser preview and a Chrome/Edge new-tab extension.

To install, open the browser's Extensions page, turn on Developer mode, choose
**Load unpacked**, and select this folder. The extension only replaces the new-tab
page; it requests no access to other websites, history, accounts or browsing data.
For the download package, extract the ZIP before selecting its folder.

Type a website address to visit it or a phrase to search Google. The chosen mood
is saved locally when storage is available. Keyboard shortcuts1–4 switch moods
when the search field is not focused.

The animated flow runs at approximately30 draws per second with a bounded pixel
budget. Hidden tabs stop rendering. Reduced motion shows a static frame, and
unavailable/lost WebGL keeps the clock, moods and search working on a plain backdrop.
Context restoration recreates the shader without restarting the page. Storage
restrictions fall back to an unsaved preference.

The shader is an original implementation using cosine-palette and domain-warping
techniques. No images, fonts, external scripts, accounts or tracker requests are
needed. Clock/date use the visitor's local timezone. Searches open Google only
after the visitor submits the form.
