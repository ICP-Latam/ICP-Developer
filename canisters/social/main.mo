import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";

actor PostCrud {
	public type ImageObject = [Nat8];

	type PostId = Nat32;
	type Post = {
		creator: Text;
		message: Text;
		image: ImageObject;
	};

	stable var postId: PostId = 0;
	let postList = HashMap.HashMap<Text, Post>(0, Text.equal, Text.hash);

	private func generatePostId() : Nat32 {
		postId += 1;
		return postId;
	};

	public query ({caller}) func whoami() : async Principal {
		return caller;
	};

	public shared (msg) func createPost(message: Text, image: ImageObject) : async () {
		let user: Text = Principal.toText(msg.caller);
		let post = {creator=user; message=message; image=image};

		postList.put(Nat32.toText(generatePostId()), post);
		Debug.print("New post created! ID: " # Nat32.toText(postId));
		return ();
	};

	public query func getPosts () : async [(Text, Post)] {
		let postIter : Iter.Iter<(Text, Post)> = postList.entries();
		let postArray : [(Text, Post)] = Iter.toArray(postIter);

		return postArray;
	};

	public query func getPost (id: Text) : async ?Post {
		let post: ?Post = postList.get(id);
		return post;
	};

	public shared (msg) func updatePost (id: Text, message: Text) : async Bool {
		let user: Text = Principal.toText(msg.caller);
		let post: ?Post = postList.get(id);

		switch (post) {
			case (null) {
				return false;
			};
			case (?currentPost) {
				let newPost: Post = {creator=user; message=message; image=currentPost.image};
				postList.put(id, newPost);
				Debug.print("Updated post with ID: " # id);
				return true;
			};
		};

	};

	public func deletePost (id: Text) : async Bool {
		let post : ?Post = postList.get(id);
		switch (post) {
			case (null) {
				return false;
			};
			case (_) {
				ignore postList.remove(id);
				Debug.print("Delete post with ID: " # id);
				return true;
			};
		};
	};
}