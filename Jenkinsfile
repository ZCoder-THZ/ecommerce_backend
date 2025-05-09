// Jenkinsfile (Declarative Pipeline)

pipeline {
    // Agent selection: 'any' uses any available agent.
    // You might restrict this with labels: agent { label 'nodejs' }
    // Or use a Docker agent for a consistent environment (see notes below)
    agent any

    environment {
        // Set environment variables for the pipeline
        NODE_ENV = 'development'
        // Database URL and secrets will be injected securely using withCredentials
    }

    options {
        // Add timestamps to console output
        timestamps()
        // Abort the pipeline if it's stuck for too long (e.g., 1 hour)
        timeout(time: 1, unit: 'HOURS')
        // Keep fewer build records (optional)
        // buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        // --- 1. Checkout Code ---
        stage('Checkout Source Code') {
            steps {
                echo 'Checking out code from repository...'
                // This command checks out the code based on the Jenkins job SCM configuration
                checkout scm
            }
        }

        // --- 2. Verify Tools ---
        stage('Verify Node & PNPM') {
            steps {
                echo 'Verifying Node.js and pnpm versions...'
                sh 'node --version'
                sh 'pnpm --version'
            }
        }

        // --- 3. Install Dependencies ---
        stage('Install PNPM Dependencies') {
            steps {
                echo 'Installing project dependencies using pnpm...'
                // Clean install is often safer in CI
                sh 'pnpm install --frozen-lockfile'
            }
        }

        // --- 4. Prepare Environment File ---
        stage('Prepare .env File') {
            steps {
                echo 'Creating .env file from Jenkins credentials...'
                // Ensure 'db-url-cred' and 'token-secret-cred' IDs exist in Jenkins Credentials
                withCredentials([
                    string(credentialsId: 'db-url-cred', variable: 'DB_URL'),
                    string(credentialsId: 'token-secret-cred', variable: 'TOKEN_SECRET')
                    // Add more credentials here if needed (e.g., API keys)
                    // string(credentialsId: 'some-api-key-cred', variable: 'API_KEY')
                ]) {
                    // Use sh script to create the .env file
                    // Use single quotes for the script block to prevent Groovy interpolation issues
                    sh '''#!/bin/sh
                        echo "DATABASE_URL=${DB_URL}" > .env
                        echo "TOKEN_SECRET=${TOKEN_SECRET}" >> .env
                        echo "NODE_ENV=development" >> .env
                        echo "FRONTEND_URL=http://localhost:5173" >> .env
                        echo "PORT=4000" >> .env
                        echo "UPLOAD_DIR=uploads" >> .env
                        echo "PUBLIC_UPLOAD_PATH=/uploads" >> .env
                        # Add any other required environment variables from your .env.example
                        echo "File .env created."
                    '''
                }
                // Optional: Show content (secrets will be masked in Jenkins log)
                // sh 'cat .env'
            }
        }

         // --- 5. Generate Prisma Client ---
         // Run generate just in case, especially if node_modules aren't cached/shared
         stage('Generate Prisma Client') {
             steps {
                 echo 'Ensuring Prisma Client is generated...'
                 sh 'pnpm prisma generate'
             }
         }

        // --- 6. Database Migrations ---
        stage('Run Database Migrations') {
            steps {
                echo 'Applying Prisma database migrations...'
                // 'deploy' applies pending migrations without prompts - suitable for CI/CD
                sh 'pnpm prisma migrate deploy'
            }
        }

        // --- 7. (Optional) Database Seeding ---
        // stage('Seed Database') {
        //     // Decide if/when seeding should run (e.g., only for 'develop' branch?)
        //     // when { expression { return env.BRANCH_NAME == 'develop' } }
        //     steps {
        //         echo 'Seeding database (if applicable)...'
        //         sh 'pnpm prisma db seed'
        //     }
        // }

        // --- 8. Build Application ---
        stage('Build TypeScript') {
            steps {
                echo 'Building application...'
                // Runs the build script defined in package.json (tsc)
                sh 'pnpm build'
                echo 'Build complete. Output should be in dist/ folder.'
            }
        }

        // --- 9. Start Application ---
        stage('Start Dev Server') {
            steps {
                // For a persistent "dev server", running it directly in Jenkins isn't ideal
                // as the job would need to run indefinitely.
                // Better options:
                // 1. Deploy to a target server and run with PM2/systemd.
                // 2. Run the server in the background on the agent (less reliable).
                // 3. Use `pnpm start` which runs the compiled JS (node dist/app.js).

                echo 'Starting application using compiled code (pnpm start)...'
                // This command will likely occupy the agent until manually stopped or the pipeline times out.
                // Consider running in the background if this agent needs to be freed up.
                // Example: Run in background (output might be lost, process management harder)
                // sh 'nohup pnpm start &'

                // Default: Run foreground (suitable if this pipeline's goal is just to *run* it here)
                sh 'pnpm start'
            }
        }
    }

    post {
        // Actions that run after the pipeline finishes
        always {
            echo 'Pipeline finished.'
            // Example: Clean up the workspace
            // cleanWs()
        }
        success {
            echo 'Pipeline executed successfully.'
            // Add notifications (Slack, Email) if desired
        }
        failure {
            echo 'Pipeline failed.'
            // Add notifications
        }
        // unstable { ... }
        // aborted { ... }
    }
}