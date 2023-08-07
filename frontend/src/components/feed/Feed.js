import React, { useEffect, useState, useRef } from "react";
import Post from "../post/Post";
import Grid from "@mui/material/Grid";
import Navbar from "../navbar/Navbar";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const CreatePost = ({ setPosts, token, setToken }) => {
  const [message, updateMessage] = useState();
  const [image, updateImage] = useState();

  const submitPost = (e) => {
    e.preventDefault();

    fetch("/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        image,
      }),
    }).then((res) => {
      if (res.status === 201) {
        setPosts((prev) => [
          {
            message,
            image,
            user: { username: "username", profilePic: "https://google.com" },
          }, ...prev
        ]);

        res.json().then((data) => {
          window.localStorage.setItem("token", data.token);
          setToken(window.localStorage.getItem("token"));
        });
      }
    });
  };
  return (
    <Grid>
      <Card style={{ maxWidth: 400, padding: "", margin: "10px auto" }}>
        <CardContent>
          {/* <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            gutterBottom
          >
            What's on your mind?
          </Typography> */}
          <form>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => updateMessage(e.target.value)}
                  multiline
                  rows={2}
                  placeholder="What's on your mind today?"
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => {
                    updateImage(e.target.value);
                  }}
                  rows={1}
                  placeholder="Image URL"
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={submitPost}
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Grid>
  );
};

const Feed = ({ navigate }) => {
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(window.localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      fetch("/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then(async (data) => {
          window.localStorage.setItem("token", data.token);
          setToken(window.localStorage.getItem("token"));
          const postData = data.posts.reverse();
          console.log(postData);
          setPosts(postData);
        });
    } else {
      navigate("/login");
    }
  }, []);

  if (token) {
    return (
      <>
        <Navbar navigate={navigate} />
        <div id="feed" role="feed">
          <h3>Welcome back! here's what you missed</h3>
          <CreatePost
            setPosts={setPosts}
            token={token}
            setToken={setToken}
          />
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: "100vh" }}
          >
            <Grid item xs={3}>
              {posts.map((post) => (
                <Post post={post} key={post._id} />
              ))}
            </Grid>
          </Grid>
        </div>
      </>
    );
  } else {
    navigate("/login");
  }
};

export default Feed;
