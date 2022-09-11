# TShell

TShell is a simple shell written within TypeScript and runs on Node.js.

### Building

first install all dependencies via `npm install` then run

```
npm run build
```

very simple

### Running

from your existing shell either run
```
npm run start
```
or
```
npm run start:nobuild
```
if you have already built it

### Todo

- actual parsing, currently we just split command inputs at spaces
- autocomplete
- features from existing shells such as command chaining