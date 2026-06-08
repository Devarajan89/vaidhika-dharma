import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

export const onRequest = defineRouteMiddleware((context) => {
   const overviewLink = context.locals.starlightRoute.toc?.items[0];
    if (overviewLink) {
        overviewLink.text = context.locals.starlightRoute.entry.data.title;
    }
});
