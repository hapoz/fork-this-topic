#!/usr/bin/env -S deno run --allow-env --allow-read

/**
 * Development setup script for Dynamic Knowledge Base API
 * Run with: deno run --allow-env --allow-read scripts/dev-setup.ts
 */

interface SetupResult {
  success: boolean;
  checks: Array<{
    name: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
  }>;
  recommendations: string[];
}

class DevSetup {
  private results: SetupResult = {
    success: true,
    checks: [],
    recommendations: [],
  };

  /**
   * Run all setup checks
   */
  async run(): Promise<SetupResult> {
    console.log('🔧 Dynamic Knowledge Base API - Development Setup\n');

    await this.checkDenoVersion();
    await this.checkEnvironment();
    await this.checkDependencies();
    await this.checkFileStructure();
    await this.checkPermissions();

    this.generateRecommendations();
    this.printResults();

    return this.results;
  }

  private async checkDenoVersion(): Promise<void> {
    const version = Deno.version.deno;
    const major = parseInt(version?.split('.')[0] || '0');

    if (major >= 1) {
      this.addCheck('Deno Version', 'pass', `Using Deno ${version}`);
    } else {
      this.addCheck(
        'Deno Version',
        'fail',
        `Deno ${version} is outdated. Please upgrade to 1.x+`,
      );
      this.results.success = false;
    }
  }

  private async checkEnvironment(): Promise<void> {
    const envVars = ['PORT', 'NODE_ENV'];
    const missing: string[] = [];

    for (const env of envVars) {
      if (!Deno.env.get(env)) {
        missing.push(env);
      }
    }

    if (missing.length === 0) {
      this.addCheck(
        'Environment Variables',
        'pass',
        'All required environment variables are set',
      );
    } else {
      this.addCheck(
        'Environment Variables',
        'warning',
        `Missing: ${missing.join(', ')}`,
      );
      this.results.recommendations.push(
        `Set environment variables: ${missing.join(', ')}`,
      );
    }
  }

  private async checkDependencies(): Promise<void> {
    try {
      // Check if deno.json exists
      const denoJson = await Deno.readTextFile('deno.json');
      const config = JSON.parse(denoJson);

      if (config.imports && Object.keys(config.imports).length > 0) {
        this.addCheck(
          'Dependencies',
          'pass',
          'Dependencies configured in deno.json',
        );
      } else {
        this.addCheck(
          'Dependencies',
          'warning',
          'No dependencies found in deno.json',
        );
      }
    } catch (error) {
      this.addCheck('Dependencies', 'fail', 'Could not read deno.json');
      this.results.success = false;
    }
  }

  private async checkFileStructure(): Promise<void> {
    const requiredDirs = [
      'models',
      'services',
      'controllers',
      'routes',
      'test',
    ];
    const missing: string[] = [];

    for (const dir of requiredDirs) {
      try {
        await Deno.stat(dir);
      } catch {
        missing.push(dir);
      }
    }

    if (missing.length === 0) {
      this.addCheck('File Structure', 'pass', 'All required directories exist');
    } else {
      this.addCheck(
        'File Structure',
        'warning',
        `Missing directories: ${missing.join(', ')}`,
      );
      this.results.recommendations.push(
        `Create missing directories: ${missing.join(', ')}`,
      );
    }
  }

  private async checkPermissions(): Promise<void> {
    const permissions = [
      '--allow-net',
      '--allow-read',
      '--allow-write',
      '--allow-env',
    ];
    this.addCheck(
      'Permissions',
      'pass',
      `Required permissions: ${permissions.join(', ')}`,
    );
  }

  private addCheck(
    name: string,
    status: 'pass' | 'fail' | 'warning',
    message: string,
  ): void {
    this.results.checks.push({ name, status, message });
  }

  private generateRecommendations(): void {
    if (this.results.recommendations.length === 0) {
      this.results.recommendations.push(
        'Your development environment is ready! 🎉',
      );
    }
  }

  private printResults(): void {
    console.log('📋 Setup Results:\n');

    for (const check of this.results.checks) {
      const icon = check.status === 'pass'
        ? '✅'
        : check.status === 'fail'
        ? '❌'
        : '⚠️';
      console.log(`${icon} ${check.name}: ${check.message}`);
    }

    console.log('\n💡 Recommendations:');
    for (const rec of this.results.recommendations) {
      console.log(`   • ${rec}`);
    }

    console.log('\n🚀 Available Commands:');
    console.log('   • deno task dev          - Start development server');
    console.log('   • deno task test         - Run tests');
    console.log('   • deno task fmt          - Format code');
    console.log('   • deno task lint         - Lint code');
    console.log('   • deno task validate     - Run all validations');
    console.log('   • deno task ci           - Run CI checks');

    console.log(
      `\n${
        this.results.success
          ? '✅ Setup completed successfully!'
          : '❌ Setup has issues that need to be resolved.'
      }`,
    );
  }
}

// Run setup if this file is executed directly
if (import.meta.main) {
  const setup = new DevSetup();
  await setup.run();
}
