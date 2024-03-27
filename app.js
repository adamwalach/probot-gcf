/**
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  console.log("Yay! The app was loaded!");

  app.on("issues.opened", async (context) => {
    return context.octokit.issues.createComment(
      context.issue({ body: "Hello, World!" })
    );
  });
  app.on("issue_comment.created", async (context) => {
    const commentBody = context.payload.comment.body;

    // Check if the comment starts with "test-upgrade"
    if (commentBody.startsWith("test-upgrade")) {
      // Define the repository name, owner, and the workflow file name
      const owner = context.payload.repository.owner.login;
      const repo = context.payload.repository.name;
      const workflow_id = "dispatch_test.yaml"; // The name of the workflow file
      const ref = "main"; // The branch name where the workflow is located
      const inputs = {
        "param1": "foo",
      };
      
      try {
        // Trigger the workflow
        await context.octokit.actions.createWorkflowDispatch({
          owner,
          repo,
          workflow_id,
          ref,
          inputs,
        });
        console.log("Workflow dispatched successfully!");
      } catch (error) {
        console.log("Error dispatching workflow:", error);
      }
    }
  });
};
