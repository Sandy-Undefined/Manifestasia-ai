import 'package:flutter_test/flutter_test.dart';
import 'package:manifestasia_flutter/core/app_config.dart';

void main() {
  test('uses bundled public app configuration', () {
    expect(AppConfig.supabaseUrl, 'https://wzuanjqvxlxxomdpwywn.supabase.co');
    expect(AppConfig.supabaseAnonKey, startsWith('sb_publishable_'));
    expect(AppConfig.apiBaseUrl, 'https://v0-manifestasia.vercel.app');
    expect(AppConfig.supabaseConfigured, isTrue);
    expect(AppConfig.apiConfigured, isTrue);
  });
}
