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

2. Config server

> Create file `.env` in root path and set config<br/>
> MONGO_LINK=link for connecting MongoDb `mongodb://[username:password@]<host>[:port]/<database>?retryWrites=true&w=majority`<br/>
> 
> MANAGER_USERNAME=username for logging in admin e.g. `admin`<br/>
> MANAGER_PASSWORD=password for logging in admin e.g. `admin`<br/>
> MANAGER_SECRET_KEY=secret key for generating JWT<br/>

3. Start server

```bash
pnpm dev
```
