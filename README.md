# Craftory Academy

Georgian furniture construction academy platform with integrated TBC Bank payments.

## Project info

**URL**: https://lovable.dev/projects/98ee606c-6f4d-4980-a3d2-a1d3df56e6a3

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/98ee606c-6f4d-4980-a3d2-a1d3df56e6a3) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Auth, Database, Edge Functions)
- TBC Bank E-Commerce API

## Payment Integration

This project uses TBC Bank hosted checkout for secure payment processing. See [TBC_INTEGRATION_GUIDE.md](./TBC_INTEGRATION_GUIDE.md) for detailed setup instructions.

### Quick Setup

1. **Apply database migration:**
```bash
supabase db push
```

2. **Configure secrets:**
```bash
cd supabase/functions
chmod +x SECRETS_SETUP.sh
./SECRETS_SETUP.sh
```

3. **Deploy Edge Function:**
```bash
supabase functions deploy tbc-payment
```

4. **Configure TBC merchant settings** with your callback URL

See [supabase/functions/README.md](./supabase/functions/README.md) for more details.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/98ee606c-6f4d-4980-a3d2-a1d3df56e6a3) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
