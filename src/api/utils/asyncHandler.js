// this is a wrapper function which for input takes a function 
// for output gives a Promise, which resolves when that function has no error
// and catches the error and passes that to next function if error has been throwned
export default fn => (req, res, next) =>
  Promise
    .resolve(fn(req, res, next))
    .catch(next);