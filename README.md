# valaxy-admin-server

Server for blogs using [Valaxy](https://github.com/YunYouJun/valaxy)

[Web app for admin](https://github.com/Rotten-LKZ/valaxy-admin-web)

[Desktop app for admin](https://github.com/Rotten-LKZ/valaxy-admin-desktop)

[Api requests](https://github.com/Rotten-LKZ/valaxy-admin-server-api)

## Usage

1. Install dependencies 

```bash
pnpm i
```

2. Config the server

> Create file `.env` in root path and set config<br/>
> MONGO_LINK=link for connecting MongoDb `mongodb://[username:password@]<host>[:port]/<database>?retryWrites=true&w=majority`<br/>
> 
> MANAGER_USERNAME=username for logging in admin e.g. `admin`<br/>
> MANAGER_PASSWORD=password for logging in admin e.g. `admin`<br/>
> MANAGER_SECRET_KEY=secret key for generating JWT<br/>
> 
> BASE_URL=base url, it will be spliced with the image address (`Required "/"`) e.g. http://172.23.107.93:3011/v1/<br/>
> REDIRECT_URL=redirect after a client is requesting a picture (If this option is `undefined`, it will response image immediately. `Not required "/"`) e.g. `http://127.0.0.1:6543`<br/>
>
> WHITE_LIST=cors e.g. `["123", "123"]` (If this option is `undefined`, it will allow all requests)<br/>


3. Create Valaxy under `template` and use `git` to push it to github *(Remember to use `npm` and `git` env is required)*

  *This program is using `git push -f` to push, so make sure that you have permission to force push and there is no conflict to avoid data loss.*

4. Create folder `upload`

5. Start the server

```bash
pnpm dev
```

## Notice

1. Api `v1/image` with `POST` will delay inserting image information into the database, which means that you can't read all image information from the database at the first time, especially uploading too many images at one time.

2. If you upload a file with the same file name within a day, the old file will be overwritten
