# AI Resume Analyzer (MERN + OpenAI)

An AI-powered web application that analyzes resumes against job descriptions and provides feedback on ATS compatibility, missing keywords, and improvement suggestions.

## Tech Stack

Frontend
- React.js
- Tailwind CSS

Backend
- Node.js
- Express.js

Database
- MongoDB

AI Integration
- OpenAI API

Tools
- pdf-parse (resume text extraction)
- Git & GitHub
- Postman

## Features

- Upload resume (PDF)
- Paste target job description
- Extract text from resume
- Compare resume with job description
- AI-generated feedback
- Missing keyword detection
- Resume improvement suggestions

## Architecture

User uploads resume → Backend parses PDF → Resume text + Job description sent to OpenAI API → AI analyzes content → Suggestions returned to frontend.

## Current Development Stage

- Backend structure created
- PDF parsing pipeline in progress
- OpenAI prompt engineering being implemented
- React frontend under development

## Future Improvements

- ATS score calculation
- Keyword highlighting
- Resume rewrite suggestions
- Dashboard for saved analyses

## Goal

Help job seekers improve resume quality and increase ATS compatibility for modern hiring systems.
