/**
 * Knowledge Base Monitoring & Analytics
 * Tracks loading status, query performance, dan data usage
 * Path: src/components/helpbutton/chat/components/logic/utils/kbMonitoring.js
 */

class KBMonitor {
  constructor() {
    this.stats = {
      loadTime: 0,
      totalQueries: 0,
      successfulQueries: 0,
      failedQueries: 0,
      dataSourceUsage: {
        ai: 0,
        uploaded: 0,
        hobbies: 0,
        skills: 0,
        certificates: 0,
        cards: 0,
        profile: 0,
        none: 0
      },
      errors: [],
      warnings: []
    };
    // Aktifkan pemantauan internal metrik secara default
    this.isMonitoring = true;
    try {
      // eslint-disable-next-line no-undef
      this.isDebug = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
    } catch {
      this.isDebug = false;
    }
  }

  /**
   * Record load completion
   */
  recordLoadComplete(loadResult, loadTimeMs) {
    if (!this.isMonitoring) return;
    
    this.stats.loadTime = loadTimeMs;
    if (this.isDebug) {
      console.group('📊 KB Load Statistics');
      console.log('Load Time:', `${loadTimeMs}ms`);
      console.log('Loaded Items:', loadResult?.loaded?.length || 0);
      console.log('Failed Items:', loadResult?.failed?.length || 0);
      if (loadResult?.warnings?.length > 0) {
        console.warn('Warnings:', loadResult.warnings);
      }
      if (loadResult?.errors && Object.keys(loadResult.errors).length > 0) {
        console.error('Errors:', loadResult.errors);
      }
      console.groupEnd();
    }
  }

  /**
   * Record query attempt
   */
  recordQuery(input, source, success = true) {
    if (!this.isMonitoring) return;
    
    this.stats.totalQueries++;
    if (success) {
      this.stats.successfulQueries++;
      if (source && Object.hasOwn(this.stats.dataSourceUsage, source)) {
        this.stats.dataSourceUsage[source]++;
      }
    } else {
      this.stats.failedQueries++;
      this.stats.dataSourceUsage.none++;
    }
  }

  /**
   * Record error
   */
  recordError(error, context) {
    if (!this.isMonitoring) return;
    
    this.stats.errors.push({
      message: error.message || String(error),
      context,
      timestamp: new Date().toISOString()
    });

    // Keep only last 50 errors
    if (this.stats.errors.length > 50) {
      this.stats.errors = this.stats.errors.slice(-50);
    }
  }

  /**
   * Record warning
   */
  recordWarning(message, context) {
    if (!this.isMonitoring) return;
    
    this.stats.warnings.push({
      message,
      context,
      timestamp: new Date().toISOString()
    });

    // Keep only last 30 warnings
    if (this.stats.warnings.length > 30) {
      this.stats.warnings = this.stats.warnings.slice(-30);
    }
  }

  /**
   * Get current statistics
   */
  getStats() {
    const successRate = this.stats.totalQueries > 0 
      ? ((this.stats.successfulQueries / this.stats.totalQueries) * 100).toFixed(2)
      : 0;

    return {
      ...this.stats,
      successRate: `${successRate}%`,
      topDataSource: Object.entries(this.stats.dataSourceUsage)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'none'
    };
  }

  /**
   * Print full report
   */
  printReport() {
    const stats = this.getStats();
    console.group('📈 Knowledge Base Report');
    console.log('Load Time:', `${stats.loadTime}ms`);
    console.log('Total Queries:', stats.totalQueries);
    console.log('Success Rate:', stats.successRate);
    console.log('Data Source Usage:', stats.dataSourceUsage);
    console.log('Top Source:', stats.topDataSource);
    if (stats.errors.length > 0) {
      console.error('Recent Errors:', stats.errors.slice(-5));
    }
    if (stats.warnings.length > 0) {
      console.warn('Recent Warnings:', stats.warnings.slice(-5));
    }
    console.groupEnd();
  }

  /**
   * Reset statistics
   */
  reset() {
    this.stats = {
      loadTime: 0,
      totalQueries: 0,
      successfulQueries: 0,
      failedQueries: 0,
      dataSourceUsage: {
        ai: 0,
        uploaded: 0,
        hobbies: 0,
        skills: 0,
        certificates: 0,
        cards: 0,
        profile: 0,
        none: 0
      },
      errors: [],
      warnings: []
    };
  }
}

// Export singleton instance
export const kbMonitor = new KBMonitor();
