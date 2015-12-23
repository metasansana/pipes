#Pipes
Transform an object by sending it down some pipes.

##Installation

```shell
npm install metasansana/pipes
```

##Usage

Use pipes to transform, validate or trigger events based on 
the keys of an object.

```javascript

import pipes from 'pipes';

var spec = {
    name:[['is', 'string']],
    age:[['is', 'number']],
    '?': [log],
    '*': [[chop, 12]]
    '@after':['timestamp']

};

var pipe = pipes.create(spec, builtins);
pipe.run({name:'Lasana', age:78}, function(ok, transformed, errors) {

  if(ok)
    console.log(transformed);

});


```
In the above, spec represents a specification of pipes
the various keys of the object will be run through.

The keys '?', '*' and '@after' have special meaning:

'?':      Run any keys on the target object that are not specified in the spec through
          this pipeline.
'*':      Run all keys through this pipeline
'@after': If there are no errors, run this pipeline.

### Pipelines

Each key in the spec represents a pipeline, a pipeline is an array of: functions, strings,
arrays or a combination of such.

Each member array encountered in the pipeline array is treated as a function call with arguments
example; `[chop, 12]`, will call the function `chop` like this: `chop(key, value, 12, pipeline)`.

Strings are treated as 'builtins' and will be replaced with a function from the `builtins`
map passed as the second argument of `pipes.create()`. 
examples:
```javascript

 var spec = {
    name:['string', 'capitalize'],
    dob:[['moment', 'format', 'll']
 };

//both keys are valid where name will be turned into two function calls and dob
//one with 2 extra arguments

```
####API

A transform, validator, filter in a pipeline has the following signature:

`function(key, value, arg1..argn, flow)`

Where `arg1..argn` represents any arguments declared in the spec.

`flow` refers to an instance of the `Flow` class which coordinates the
flow or key value pairs through the pipeline.

Each transform, validator or filter in the pipeline is executed one 
by one and MUST call `flow.next()` when finished, in order for the "pipeline to keep running".

`flow.next()` is defined as:

```javascript

@param {Error|null} err Pass an error object here to indicate an error
                        occured. Very useful for validation.
@param {string} key     The key of the property that has finished, 
                        this gives you a chance to format the key name.
@param {*} value        The value you want the key to have
Flow.prototype.next = function(err, key, value) {

}
```
###Builtins

This package ships with no builtins, you either have to
define your own or use the `metasansana/pipes-builtins` specified 
there. I was tempted to simply include one of the string manipulation
libraries at least but most of them were to general.

###License

Apache-2.0

