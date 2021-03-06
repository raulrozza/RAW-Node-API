const http = require('http');
const Hero = require('./entities/hero');

const HeroFactory = require('./factories/heroFactory');

const PORT = 3000;
const DEFAULT_HEADER = { 'Content-Type': 'application/json' };

const heroService = HeroFactory.generateInstance();

const routes = {
    '/heroes:get': async (request, response) => {
        const { id } = request.queryString;

        const heroes = await heroService.find(id);

        response.write(JSON.stringify({ results: heroes }));

        response.end();
    },
    '/heroes:post': async (request, response) => {
        // async iterator
        for await (const data of request) {
            try {
                const item = JSON.parse(data);

                const hero = new Hero(item);

                const { error, valid } = hero.isValid();

                if (!valid) {
                    response.writeHead(400, DEFAULT_HEADER);
                    response.write(JSON.stringify({ error: error.join(',') }));
                    return response.end();
                }

                const id = await heroService.create(hero);

                response.writeHead(201, DEFAULT_HEADER);
                response.write(
                    JSON.stringify({
                        success: 'Hero successfully created!',
                        id,
                    }),
                );

                response.end();
            } catch (error) {
                return handleError(response)(error);
            }
        }
    },
    default: (request, response) => {
        response.write('Hello!');
        response.end();
    },
};

const handleError = response => error => {
    console.error('An Error ocurred:', error);

    response.writeHead(500, DEFAULT_HEADER);
    response.write(JSON.stringify({ error: 'Internal Server Error!' }));

    return response.end();
};

const handler = (request, response) => {
    const { url, method } = request;

    const [, route, id] = url.split('/');

    request.queryString = { id: isNaN(id) ? id : Number(id) };

    const key = `/${route}:${method.toLowerCase()}`;

    response.writeHead(200, DEFAULT_HEADER);

    const chosen = routes[key] || routes.default;

    return chosen(request, response).catch(handleError(response));
};

http.createServer(handler).listen(PORT, () =>
    console.log(`Server running at port ${PORT}`),
);
