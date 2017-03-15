#pipe-transform

# Abandoned, turns out plain old functions are much easier.

Transform an object by sending it down some pipes.

##Installation

```shell
npm install pipe-transform
```

##Usage

This package can be used to setup custom transforms,
validation or trigger events based on the property values of an object.

It comes in handy if you want to decouple that kind of logic
from say a complicated ODM/ORM?

```javascript

import pipes from 'pipe-transform';

var spec = {
    name:  [['is', 'string']],
    age:   [['is', 'number']],
    '?':   ['log'],
    '*':   [[chop, 12]]
    '@after':['timestamp']
};

var pipe = pipes(spec);

pipe.run({name:'Lasana', age:78},
(err, transformed)=> (err)? console.log(err.errors) : console.log(transformed));

```

In the above, the variable `spec` is how you configure the pipes filters
to pass the object through.

#### Special Keys

The keys `?`, `*` and `@after` have special meaning:

* '?':      Run any unspecified keys through this pipeline.
* '*':      Run every key through this pipeline.
* '@after': If there are no errors, run the entire object through this pipeline.

### Pipelines

Each key in the spec represents a pipeline, a pipeline is an array of:
* functions
* strings
* arrays
* a combination of the above.

Each time the next filter in a pipeline is an array, the array is treated
as a function call (think `Function#apply`). The first element in the array
is the filter and the remaining members are arguments.

Example: 

`[chop, 12]`, will call the function `chop` like this: `chop(key, value, 12, pipeline)`.

Strings are treated as 'builtins' and will be replaced with a registered filter.

```javascript

 var spec = {
    name:['string', 'capitalize'],
    dob:[['moment', 'format', 'll']
 };

```

####API

A transform, validator, filter in a pipeline has the following signature:

`function(key, value, line, arg1..argn)`

Where `arg1..argn` represents any arguments declared in the spec.

`line` refers to an instance of the `Pipeline` class which coordinates the
filtering of a key value pair.

Each filter in the pipeline is executed one by one and MUST call
`line.next()` when finished, in order for the pipeline to keep running.

`line.next()` has the following signature:

```javascript

@param {Error|null} err Pass an error object here to indicate an error
                        occured. Very useful for validation; stops the flow here.

@param {string} key     The key of the property that has finished, 
                        this gives you a chance to format the key name.

@param {*} value        The value you want the key to have

```
###Builtins

This package ships with a few builtin filters, see the
[source](https://github.com/metasansana/pipes/blob/master/src/builtins/index.js) 

You will want to setup your own via the `addFilter` api.

###License

Apache-2.0

