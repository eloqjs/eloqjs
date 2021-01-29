import express from 'express'
import bodyParser from 'body-parser'
import faker from 'faker'
import { collect, Collection } from '@eloqjs/collection'

Collection.config = {
  primaryKey: ({ collection }) => {
    const item = collection.first()

    if (item && item.title) {
      return 'slug'
    }

    return 'id'
  }
}

// Create app
const app = express()

// Install middleware
app.use(bodyParser.json())

const usersArr = new Array(faker.random.number({ min: 1, max: 50 })).fill(null)

// Users
const users = {
  data: usersArr.map((_value, index) => ({
    id: index + 1,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar()
  }))
}

const postsArr = new Array(faker.random.number({ min: 1, max: 50 })).fill(null)

// Posts
const posts = {
  data: postsArr.map((_value, index) => {
    const userID = faker.random.number({ min: 1, max: users.data.length })

    return {
      id: index + 1,
      title: faker.lorem.words(),
      publishedAt: faker.date.recent(),
      image: faker.image.abstract(),
      excerpt: faker.lorem.sentence(),
      text: faker.lorem.paragraphs(3),
      slug: faker.lorem.slug(),
      user: users.data.find((user) => {
        return user.id === userID
      })
    }
  })
}

// [GET] /users
app.get('/users', (_req, res) => {
  res.json(users)
})

// [GET] /users/:id
app.get('/users/:id', (req, res) => {
  const user = collect(users.data).find(Number(req.params.id))

  if (user) {
    res.json(user)
  } else {
    res.status(404).send('404: User not Found')
  }
})

// [GET] /users/:id/posts
app.get('/users/:id/posts', (req, res) => {
  let filter: Record<string, any> = {}
  if (req.query.filter) {
    filter = req.query.filter as Record<string, any>
  }

  const user = collect(users.data).find(Number(req.params.id))
  const data = collect(posts.data)
    .where('user.id', Number(req.params.id))
    .where('title', 'LIKE', filter.title)
    .take(Number(req.query.limit))

  if (user) {
    res.json({ data })
  } else {
    res.status(404).send('404: User not Found')
  }
})

// [GET] /users/:userId/posts/:postId
app.get('/users/:userId/posts/:postId', (req, res) => {
  const user = collect(users.data).find(Number(req.params.userId))
  const post = collect(posts.data)
    .where('user.id', Number(req.params.userId))
    .find(req.params.postId)

  if (user) {
    if (post) {
      res.json(post)
    } else {
      res.status(404).send('404: Post not Found')
    }
  } else {
    res.status(404).send('404: User not Found')
  }
})

// [GET] /posts
app.get('/posts', (_req, res) => {
  res.json(posts)
})

// [POST] /posts
app.post('/posts', (req, res) => {
  res.json(posts.data[0])
})

// [GET] /posts/:slug
app.get('/posts/:slug', (req, res) => {
  const post = collect(posts.data).find(req.params.slug)

  if (post) {
    res.json(post)
  } else {
    res.status(404).send('404: Post not Found')
  }
})

// [PATCH] /posts/:slug
app.patch('/posts/:slug', (req, res) => {
  const post = collect(posts.data).find(req.params.slug)

  if (post) {
    post.title = req.body.title

    res.json(post)
  } else {
    res.status(404).send('404: Post not Found')
  }
})

// [DELETE] /posts/:slug
app.delete('/posts/:slug', (req, res) => {
  const post = collect(posts.data).find(req.params.slug)

  if (post) {
    // const index = posts.data.indexOf(post)
    // delete posts.data[index]

    res.json(post)
  } else {
    res.status(404).send('404: Post not Found')
  }
})

/* JSON API Responses */

// [GET] /json/users
app.get('/json/users', (_req, res) => {
  res.json({
    data: users.data.map((user) => ({
      type: 'users',
      id: user.id,
      attributes: {
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar
      }
    }))
  })
})

// [GET] /json/users/:id
app.get('/json/users/:id', (req, res) => {
  const user = collect(users.data).find(Number(req.params.id))

  res.json({
    data: {
      type: 'users',
      id: user?.id,
      attributes: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        avatar: user?.avatar
      }
    }
  })
})

// [GET] /json/users/:id/posts
app.get('/json/users/:id/posts', (req, res) => {
  const user = collect(users.data).find(Number(req.params.id))
  const _posts = posts.data.filter((post) => post.user?.id === user?.id)

  res.json({
    data: _posts.map((post) => ({
      type: 'posts',
      id: post.id,
      attributes: {
        title: post.title,
        publishedAt: post.publishedAt,
        image: post.image,
        excerpt: post.excerpt
      },
      relationships: {
        user: {
          data: {
            type: 'users',
            id: user?.id
          }
        }
      }
    })),
    included: [
      {
        type: 'users',
        id: user?.id,
        attributes: {
          firstName: user?.firstName,
          lastName: user?.lastName,
          avatar: user?.avatar
        }
      }
    ]
  })
})

// [GET] /json/posts
app.get('/json/posts', (_req, res) => {
  const usersIDs: number[] = []
  const _posts = posts.data.map((post) => {
    usersIDs.push(post.user!.id)

    return {
      type: 'posts',
      id: post.id,
      attributes: {
        title: post.title,
        publishedAt: post.publishedAt,
        image: post.image,
        excerpt: post.excerpt,
        text: post.text,
        slug: post.slug
      },
      relationships: {
        user: {
          data: {
            type: 'users',
            id: post.user?.id
          }
        }
      }
    }
  })
  const _users = users.data.filter((user) => usersIDs.includes(user.id))

  res.json({
    data: _posts,
    included: _users.map((user) => ({
      type: 'users',
      id: user.id,
      attributes: {
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar
      }
    }))
  })
})

// [GET] /json/posts/:slug
app.get('/json/posts/:slug', (req, res) => {
  const post = collect(posts.data).find(req.params.slug)

  res.json({
    data: {
      type: 'posts',
      id: post?.id,
      attributes: {
        title: post?.title,
        publishedAt: post?.publishedAt,
        image: post?.image,
        excerpt: post?.excerpt,
        text: post?.text,
        slug: post?.slug
      },
      relationships: {
        user: {
          data: {
            type: 'users',
            id: post?.user?.id
          }
        }
      }
    },
    included: [
      {
        type: 'users',
        id: post?.user?.id,
        attributes: {
          firstName: post?.user?.firstName,
          lastName: post?.user?.lastName,
          avatar: post?.user?.avatar
        }
      }
    ]
  })
})

// Error handler
// Handle 404
app.use((_req, res) => {
  res.status(404).send('404: Page not Found')
})

// Handle 500
app.use((error, _req, res) => {
  console.error(error) // eslint-disable-line no-console
  // @ts-ignore
  res.status(500).send('500: Internal Server Error')
})

// -- Export app --
export const path = '/api'
export const handler = app
