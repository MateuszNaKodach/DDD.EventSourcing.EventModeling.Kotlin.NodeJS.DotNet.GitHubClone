FROM mcr.microsoft.com/dotnet/sdk:5.0 as build
WORKDIR /app/dotnet/
COPY . .
RUN dotnet build
RUN dotnet publish

FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app/dotnet/
COPY --from=build /app/dotnet/EventModelingGitHubCloneDotNet/bin/Debug/net5.0/publish/ .
ENTRYPOINT ["dotnet", "EventModelingGitHubCloneDotNet.dll"]
