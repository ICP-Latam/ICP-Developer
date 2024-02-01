export const idlFactory = ({ IDL }) => {
  const ImageObject = IDL.Vec(IDL.Nat8);
  const Post = IDL.Record({
    'creator' : IDL.Text,
    'message' : IDL.Text,
    'image' : ImageObject,
  });
  return IDL.Service({
    'createPost' : IDL.Func([IDL.Text, ImageObject], [], []),
    'deletePost' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'getPost' : IDL.Func([IDL.Text], [IDL.Opt(Post)], ['query']),
    'getPosts' : IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, Post))], ['query']),
    'updatePost' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
