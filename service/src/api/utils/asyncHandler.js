// this is a wrapper function which for input takes a function fn and
// for output gives a Promise, which resolves the result of invokation of function fn
// and catches the error if function fn throws and passes that to function next
export default fn => (req, res, next) =>
  Promise
    .resolve(fn(req, res, next))
    .catch(next);