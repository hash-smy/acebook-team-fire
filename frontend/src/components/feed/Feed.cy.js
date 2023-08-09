import Feed from "./Feed";
const navigate = () => {};

let token = window.localStorage.setItem("token", "fakeToken");

describe("Feed", () => {
  it("Calls the /posts endpoint and lists all the posts", () => {
    window.localStorage.setItem("token", "fakeToken");

    cy.intercept("GET", "/posts", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          posts: [
            { _id: 1, message: "Hello, world", likes: 1 },
            { _id: 2, message: "Hello again, world", likes: 2 },
          ],
        },
      });
    }).as("getPosts");

    cy.mount(<Feed navigate={navigate} />);

    cy.wait("@getPosts").then(() => {
      cy.get('[data-cy="post"]')
        .should("contain.text", "Hello, world 1Like")
        .and("contain.text", "Hello again, world 2Like");
    });
  });
  it("Calls the PATCH /posts endpoint and increments like count", () => {
    window.localStorage.setItem("token", "fakeToken");
    cy.intercept("GET", "/posts", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          posts: [
            { _id: 1, message: "Hello, world", likes: 2 },
            { _id: 2, message: "Hello again, world", likes: 2 },
          ],
        },
      });
    }).as("getPosts");

    cy.intercept("PATCH", "/posts/1", (req) => {
      req.reply({
        statusCode: 200,
        body: { likes: 3 },
      });
    }).as("patchPosts");

    cy.mount(<Feed navigate={navigate} />);
    cy.wait("@getPosts");
    cy.get('[class="like-btn-1"]').click().then(() => {
      cy.get('[data-cy="post"]')
      .should("contain.text", "Hello, world 3Like")
      .and("contain.text", "Hello again, world 2Like");
    });
    

  });

  it("Calls the PATCH /posts endpoint and increments like count for both messages", () => {
    window.localStorage.setItem("token", "fakeToken");
    cy.intercept("GET", "/posts", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          posts: [
            { _id: 1, message: "Hello, world", likes: 2 },
            { _id: 2, message: "Hello again, world", likes: 2 },
          ],
        },
      });
    }).as("getPosts");

    cy.intercept("PATCH", "/posts/1", (req) => {
      req.reply({
        statusCode: 200,
        body: { likes: 3 },
      });
    }).as("patchPosts");

    cy.intercept("PATCH", "/posts/2", (req) => {
      req.reply({
        statusCode: 200,
        body: { likes: 3 },
      });
    }).as("patch2Posts");

    cy.mount(<Feed navigate={navigate} />);
    cy.wait("@getPosts").then(()=>{
      cy.wait(500).then(() => {
        cy.get('[class="like-btn-1"]').click();
        cy.get('[class="like-btn-2"]').click();
      })
    }).then(() => {
      cy.wait(500).then(() => {
        cy.get('[data-cy="post"]').eq(0).should("contain.text", "Hello, world 3Like");
        cy.get('[data-cy="post"]').eq(-1).should("contain.text", "Hello again, world 3Like");
      })
    });
  });

  it("Calls the PATCH /posts endpoint and increments like count twice", () => {
    window.localStorage.setItem("token", "fakeToken");
    cy.intercept("GET", "/posts", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          posts: [
            { _id: 1, message: "Hello, world", likes: 2 },
            { _id: 2, message: "Hello again, world", likes: 2 },
          ],
        },
      });
    }).as("getPosts");

    cy.intercept("PATCH", "/posts/1", (req) => {
      req.reply({
        statusCode: 200,
        body: { likes: 3 },
      });
    }).as("patchPosts");

    cy.mount(<Feed navigate={navigate} />);
    cy.wait("@getPosts").then(()=>{
      cy.wait(500).then(() => {
        cy.get('[class="like-btn-1"]').click().click().click();
      })
    }).then(() => {
      cy.wait(500).then(() => {
        cy.get('[data-cy="post"]').eq(0).should("contain.text", "Hello, world 5Like");
        cy.get('[data-cy="post"]').eq(-1).should("contain.text", "Hello again, world 2Like");
      })
      
    });
    
  });
});
