TODO
====

1. Bubble up errors as they occur rather than just passing to clbk on file read; currently, will never pass content because it requires ALL files to pass with no exceptions. Let consumer decide how to handle file read errors.
2. #1 requires synchronous read and a next syntax, like in middleware
3. Watch files for changes and auto-update the tree.
	-	inclusion/exclusion filters
	-	file content filter
4. search file content
	-	open file streams
	-	perform text search
	-	return search results containing files meeting search criteria
	-	WARNING: rabbit role => full text search
5. include/exclude files from tree based on file content filters
6. branches (only the dirs)
7. flag indicating whether to ignore empty directories
	-	default behavior is to do so
	-	however, may want to know about "barren" branches
8. move body of `search` method to private function
	-	allows `read` to utilize the same private fcn, without duplicating type checking etc.
		-	what if search results are saved? Then `read` can just be a fluent method which "reads" the search results.

		``` javascript
		tree.search()
			.read();
		```

9. maybe instead of `search`, call the method `filter`
	-	may want to reserve `search` method for full text search
	-	if so, could have a separate `search` plugin which pulls in, say, a levelDB and actually does document indexing
		-	may want the Tree to be an event-emitter to facilitate plugins; e.g., having to sync the db, etc
			-	file changes
			-	new "filter" results
			-	Tree destruction
			-	Tree creation
			- 	see node-walkit (or substack module which event emits)
10. 



- 	compute: moving regex
	-	input string
	-	window size
	-	return boolean or the match or the window?
		-	option:
			-	test (boolean => boolean/logical array)
			-	match
			-	value
-	flow: regex stream
	-	sink
		-	regex over everything in memory
	-	moving
		-	stream analog of compute

