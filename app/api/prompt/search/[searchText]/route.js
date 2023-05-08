import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
// import User from "@models/user";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const searchText = params.searchText;
    console.log(searchText);
    const prompts = await Prompt.find({
      $or: [
        { prompt: { $regex: searchText } },
        { tag: { $regex: searchText } },
      ],
    }).populate("creator");

    // const users = await User.find({
    //   $or: [
    //     { email: { $regex: searchText } },
    //     { username: { $regex: searchText } },
    //   ],
    // });
    // const userPrompts = await Promise.all(
    //   users.map(async (user) => {
    //     const prompts = await Prompt.find({ creator: user._id }).populate(
    //       "creator"
    //     );
    //     return prompts;
    //   })
    // );

    return new Response(JSON.stringify(prompts), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), {
      status: 500,
    });
  }
};
