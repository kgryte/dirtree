TODO
====

1. Bubble up errors as they occur rather than just passing to clbk on file read; currently, will never pass content because it requires ALL files to pass with no exceptions. Let consumer decide how to handle file read errors.
2. #1 requires synchronous read and a next syntax, like in middleware
3. Watch files for changes and auto-update the tree.

