# Use the official Deno image
FROM denoland/deno:1.40

# Set working directory
WORKDIR /app

# Copy dependency files
COPY deno.json deno.lock ./

# Cache dependencies
RUN deno cache main.ts

# Copy source code
COPY . .

# Create a non-root user
RUN addgroup --system --gid 1001 deno && \
    adduser --system --uid 1001 --ingroup deno deno

# Change ownership of the app directory
RUN chown -R deno:deno /app

# Switch to non-root user
USER deno

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD deno run --allow-net main.ts || exit 1

# Run the application
CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "--allow-write", "main.ts"] 