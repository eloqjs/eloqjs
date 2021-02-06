# Demo App

This is a basic example of how you might use `eloqjs`. This demo uses Laravel Lumen.

#### Setup

```
yarn install

# Create the local database and migrate
touch database/database.sqlite
php artisan migrate
```

#### Build

```
yarn build --watch
```

#### Serve

```
# php -S localhost:8000 -t public
./server.sh
```

### License

[MIT](LICENSE)
