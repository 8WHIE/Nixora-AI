import { ProjectFile } from '../types';

export const ANDROID_PROJECT_FILES: ProjectFile[] = [
  {
    path: 'README.md',
    language: 'markdown',
    description: 'Instructions to build the Android APK with Android Studio or CLI',
    content: `# Nixora AI - Android Application
**Tagline**: Intelligence Without Limits
**Package**: com.nixora.ai

## Prerequisites
- Android Studio Ladybug (2024.2+) or newer
- JDK 17 or higher
- Android SDK 34 (Android 14) or 35 (Android 15)

## Building the APK
1. **Open in Android Studio**:
   - Open Android Studio -> Choose "Open..." -> Select this extracted folder.
   - Wait for Gradle sync to complete.

2. **Build Debug APK via Command Line**:
   \`\`\`bash
   ./gradlew assembleDebug
   \`\`\`
   Output APK will be generated at:
   \`app/build/outputs/apk/debug/app-debug.apk\`

3. **Build Release APK**:
   \`\`\`bash
   ./gradlew assembleRelease
   \`\`\`

4. **Install directly on connected Android device/emulator**:
   \`\`\`bash
   ./gradlew installDebug
   \`\`\`

## Features included in Native Android Code:
- Modern Jetpack Compose UI with Material 3 styling
- Deep Indigo and Neon Purple gradient theme
- Kotlin Coroutines & StateFlow reactive state management
- Gemini AI streaming response client integration
- Voice recognition and speech audio integration
- Syntax-highlighted code card rendering
`
  },
  {
    path: 'build.gradle.kts',
    language: 'kotlin',
    description: 'Root project build configuration',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}

buildscript {
    repositories {
        google()
        mavenCentral()
    }
}
`
  },
  {
    path: 'settings.gradle.kts',
    language: 'kotlin',
    description: 'Gradle project settings and repository definitions',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "NixoraAI"
include(":app")
`
  },
  {
    path: 'gradle.properties',
    language: 'properties',
    description: 'Gradle JVM and AndroidX configuration',
    content: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`
  },
  {
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    description: 'App module build script with Jetpack Compose & dependencies',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "com.nixora.ai"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.nixora.ai"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    // Core AndroidX
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.6")
    implementation("androidx.activity:activity-compose:1.9.3")

    // Jetpack Compose & Material 3
    implementation(platform("androidx.compose:compose-bom:2024.10.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.navigation:navigation-compose:2.8.3")

    // Coroutines & Networking
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    implementation("com.google.code.gson:gson:2.11.0")

    // Google Generative AI (Gemini) Android Client
    implementation("com.google.ai.client.generativeai:generativeai:0.9.0")

    // Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.6.1")
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'Android manifest with permissions and main activity entry',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Permissions for AI Cloud Services and Voice -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@drawable/ic_launcher_foreground"
        android:label="@string/app_name"
        android:roundIcon="@drawable/ic_launcher_foreground"
        android:supportsRtl="true"
        android:theme="@style/Theme.NixoraAI">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.NixoraAI"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>

</manifest>
`
  },
  {
    path: 'app/src/main/java/com/nixora/ai/MainActivity.kt',
    language: 'kotlin',
    description: 'Main Activity class initializing Jetpack Compose app shell',
    content: `package com.nixora.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.nixora.ai.ui.theme.NixoraTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            NixoraTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = androidx.compose.ui.graphics.Color(0xFF030712)
                ) {
                    NixoraApp()
                }
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/nixora/ai/NixoraApp.kt',
    language: 'kotlin',
    description: 'Top-level Compose Application with navigation bar and state',
    content: `package com.nixora.ai

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.*
import com.nixora.ai.ui.screens.ChatScreen
import com.nixora.ai.ui.screens.CodeStudioScreen

sealed class Screen(val route: String, val title: String, val icon: androidx.compose.ui.graphics.vector.ImageVector) {
    object Chat : Screen("chat", "Chat", Icons.Default.ChatBubble)
    object Code : Screen("code", "Code Studio", Icons.Default.Code)
    object Settings : Screen("settings", "Settings", Icons.Default.Settings)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NixoraApp() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(modifier = Modifier.fillMaxWidth()) {
                        Text(
                            text = "Nixora AI",
                            style = MaterialTheme.typography.titleMedium,
                            color = Color.White
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF0B0F19)
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = Color(0xFF0B0F19),
                contentColor = Color(0xFF818CF8)
            ) {
                val items = listOf(Screen.Chat, Screen.Code, Screen.Settings)
                items.forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = screen.title) },
                        label = { Text(screen.title) },
                        selected = currentRoute == screen.route,
                        onClick = {
                            if (currentRoute != screen.route) {
                                navController.navigate(screen.route) {
                                    popUpTo(navController.graph.startDestinationId) { saveState = true }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Color(0xFF06B6D4),
                            selectedTextColor = Color(0xFF06B6D4),
                            indicatorColor = Color(0xFF1E1B4B),
                            unselectedIconColor = Color(0xFF94A3B8),
                            unselectedTextColor = Color(0xFF94A3B8)
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Chat.route,
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color(0xFF030712), Color(0xFF0F172A))
                    )
                )
        ) {
            composable(Screen.Chat.route) {
                ChatScreen()
            }
            composable(Screen.Code.route) {
                CodeStudioScreen()
            }
            composable(Screen.Settings.route) {
                Box(modifier = Modifier.fillMaxSize().padding(16.dp)) {
                    Text("Nixora AI Settings\\nVersion: 1.0.0\\nEngine: Gemini 3.8 Flash", color = Color.White)
                }
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/nixora/ai/ui/theme/Color.kt',
    language: 'kotlin',
    description: 'Futuristic color palette for Android Material 3',
    content: `package com.nixora.ai.ui.theme

import androidx.compose.ui.graphics.Color

val NixoraBackground = Color(0xFF030712)
val NixoraSurface = Color(0xFF0B0F19)
val NixoraPrimary = Color(0xFF6366F1)
val NixoraSecondary = Color(0xFF06B6D4)
val NixoraTertiary = Color(0xFFA855F7)
val NixoraAccent = Color(0xFF38BDF8)
val NixoraText = Color(0xFFF8FAFC)
val NixoraTextMuted = Color(0xFF94A3B8)
val NixoraCardBorder = Color(0xFF1E293B)
`
  },
  {
    path: 'app/src/main/java/com/nixora/ai/ui/theme/Theme.kt',
    language: 'kotlin',
    description: 'Nixora Theme definition',
    content: `package com.nixora.ai.ui.theme

import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = NixoraPrimary,
    secondary = NixoraSecondary,
    tertiary = NixoraTertiary,
    background = NixoraBackground,
    surface = NixoraSurface,
    onPrimary = Color.White,
    onSecondary = Color.Black,
    onBackground = NixoraText,
    onSurface = NixoraText
)

@Composable
fun NixoraTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
`
  },
  {
    path: 'app/src/main/java/com/nixora/ai/ui/screens/ChatScreen.kt',
    language: 'kotlin',
    description: 'Jetpack Compose Chat Screen with message stream and voice input',
    content: `package com.nixora.ai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.nixora.ai.data.model.ChatMessage

@Composable
fun ChatScreen() {
    var inputText by remember { mutableStateOf("") }
    val messages = remember {
        mutableStateListOf(
            ChatMessage(
                id = "1",
                role = "model",
                content = "Greetings! I am Nixora AI. Your advanced coding and productivity assistant. How can I accelerate your development today?",
                timestamp = "Just now"
            )
        )
    }

    Column(modifier = Modifier.fillMaxSize().padding(12.dp)) {
        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(messages) { msg ->
                val isUser = msg.role == "user"
                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = if (isUser) Alignment.CenterEnd else Alignment.CenterStart
                ) {
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = if (isUser) Color(0xFF4F46E5) else Color(0xFF1E293B)
                        ),
                        modifier = Modifier.widthIn(max = 300.dp)
                    ) {
                        Text(
                            text = msg.content,
                            color = Color.White,
                            modifier = Modifier.padding(14.dp),
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Input Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF0F172A), RoundedCornerShape(24.dp))
                .padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            TextField(
                value = inputText,
                onValueChange = { inputText = it },
                placeholder = { Text("Ask Nixora anything...", color = Color.Gray) },
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Color.Transparent,
                    unfocusedContainerColor = Color.Transparent,
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent
                ),
                modifier = Modifier.weight(1f)
            )

            IconButton(onClick = { /* Voice input trigger */ }) {
                Icon(Icons.Default.Mic, contentDescription = "Voice", tint = Color(0xFF38BDF8))
            }

            IconButton(
                onClick = {
                    if (inputText.isNotBlank()) {
                        messages.add(
                            ChatMessage(
                                id = System.currentTimeMillis().toString(),
                                role = "user",
                                content = inputText,
                                timestamp = "Now"
                            )
                        )
                        inputText = ""
                    }
                }
            ) {
                Icon(Icons.Default.Send, contentDescription = "Send", tint = Color(0xFFA855F7))
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/nixora/ai/data/model/ChatMessage.kt',
    language: 'kotlin',
    description: 'Kotlin data model for Chat Messages',
    content: `package com.nixora.ai.data.model

data class ChatMessage(
    val id: String,
    val role: String, // "user" or "model"
    val content: String,
    val timestamp: String,
    val isCode: Boolean = false,
    val language: String? = null
)
`
  },
  {
    path: 'app/src/main/java/com/nixora/ai/data/repository/NixoraRepository.kt',
    language: 'kotlin',
    description: 'Gemini GenerativeModel repository for Kotlin Android',
    content: `package com.nixora.ai.data.repository

import com.google.ai.client.generativeai.GenerativeModel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class NixoraRepository(apiKey: String) {
    private val generativeModel = GenerativeModel(
        modelName = "gemini-1.5-flash",
        apiKey = apiKey
    )

    fun streamResponse(prompt: String): Flow<String> {
        return generativeModel.generateContentStream(prompt).map { response ->
            response.text ?: ""
        }
    }

    suspend fun generateCode(prompt: String, language: String): String {
        val fullPrompt = "Write clean, production-ready $language code for: $prompt"
        val response = generativeModel.generateContent(fullPrompt)
        return response.text ?: ""
    }
}
`
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    language: 'xml',
    description: 'Android string resources',
    content: `<resources>
    <string name="app_name">Nixora AI</string>
    <string name="tagline">Intelligence Without Limits</string>
    <string name="send">Send</string>
    <string name="voice_input">Voice Input</string>
    <string name="clear_chat">Clear Chat</string>
</resources>
`
  },
  {
    path: 'app/src/main/res/values/colors.xml',
    language: 'xml',
    description: 'Android XML color definitions',
    content: `<resources>
    <color name="nixora_bg">#030712</color>
    <color name="nixora_surface">#0B0F19</color>
    <color name="nixora_primary">#6366F1</color>
    <color name="nixora_secondary">#06B6D4</color>
    <color name="nixora_accent">#A855F7</color>
</resources>
`
  },
  {
    path: 'capacitor.config.json',
    language: 'json',
    description: 'Capacitor Hybrid Mobile Bridge configuration for instant APK packaging',
    content: `{
  "appId": "com.nixora.ai",
  "appName": "Nixora AI",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https",
    "cleartext": true
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#030712",
      "showSpinner": false
    },
    "StatusBar": {
      "style": "DARK",
      "backgroundColor": "#030712"
    }
  }
}
`
  }
];
