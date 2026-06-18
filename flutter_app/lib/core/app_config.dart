class AppConfig {
  static const supabaseUrl = 'https://wzuanjqvxlxxomdpwywn.supabase.co';
  static const supabaseAnonKey =
      'sb_publishable_55zA6h1wfgRb5en8FpnRxg_X5H_i1QZ';
  static const apiBaseUrl = 'https://v0-manifestasia.vercel.app';
  static const signupOtpCodeLength = 8;

  static bool get supabaseConfigured =>
      supabaseUrl.isNotEmpty && supabaseAnonKey.isNotEmpty;

  static bool get apiConfigured => apiBaseUrl.isNotEmpty;
}
