import { FastifyInstance } from 'fastify';
import {
    get_user_posts, get_post,
    get_comments, create_post, comment_on_post, vote_on_post,
    reply_on_comment, vote_on_comment, add_tag_on_post,
    delete_post, toggle_post_visibility,
    get_recent_posts,
    update_post
} from './post.controller';


export default async function postRoutes(fastify: FastifyInstance) {
    fastify.get('/', {
        preHandler: [fastify.authenticate],
        handler: get_user_posts
    });

    fastify.get('/post/:post_id', {
        preHandler: [fastify.authenticate],
        handler: get_post
    });

    fastify.put('/post/update', {
        preHandler: [fastify.authenticate],
        handler: update_post
    })

    fastify.get('/posts/recent', {
        preHandler: [fastify.authenticate],
        handler: get_recent_posts
    })

    fastify.post('/comments/view', {
        preHandler: [fastify.authenticate],
        handler: get_comments
    });

    fastify.post('/post/create', {
        preHandler: [fastify.authenticate],
        handler: create_post
    });

    fastify.post('/post/comment', {
        preHandler: [fastify.authenticate],
        handler: comment_on_post
    });

    fastify.post('/post/vote', {
        preHandler: [fastify.authenticate],
        handler: vote_on_post
    });

    fastify.post('/post/comment/reply', {
        preHandler: [fastify.authenticate],
        handler: reply_on_comment
    });

    fastify.post('/post/comment/vote', {
        preHandler: [fastify.authenticate],
        handler: vote_on_comment
    });

    fastify.post('/post/tag', {
        preHandler: [fastify.authenticate],
        handler: add_tag_on_post
    });

    fastify.delete('/post/delete', {
        preHandler: [fastify.authenticate],
        handler: delete_post
    });

    fastify.put('/post/toggle-visibility', {
        preHandler: [fastify.authenticate],
        handler: toggle_post_visibility
    });
}
