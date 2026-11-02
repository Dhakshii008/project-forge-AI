import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Folder,
  FolderOpen,
  FileCode,
  Copy,
  ChevronRight,
  ChevronDown,
} from 'lucide-react-native';
import { Header, Card, Button } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

interface FileNode {
  name: string;
  type: 'folder' | 'file';
  code?: string;
  children?: FileNode[];
}

export default function WorkspaceStarterCodeScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const insets = useSafeAreaInsets();

  const [selectedFile, setSelectedFile] = useState<string>('server.ts');
  const [activeCode, setActiveCode] = useState<string>(
    `import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws) => {
  console.log('Client telemetry stream attached');
  ws.send(JSON.stringify({ status: 'CONNECTED', timestamp: Date.now() }));
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(\`ProjectForge service operational on port \${PORT}\`);
});`
  );

  const fileTree: FileNode[] = [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'server.ts',
          type: 'file',
          code: `import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws) => {
  console.log('Client telemetry stream attached');
  ws.send(JSON.stringify({ status: 'CONNECTED', timestamp: Date.now() }));
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(\`ProjectForge service operational on port \${PORT}\`);
});`,
        },
        {
          name: 'routes',
          type: 'folder',
          children: [
            {
              name: 'telemetry.ts',
              type: 'file',
              code: `import { Router } from 'express';
const router = Router();

router.post('/ingest', (req, res) => {
  const { deviceId, metrics } = req.body;
  if (!deviceId || !metrics) {
    return res.status(400).json({ error: 'Missing telemetry payload' });
  }
  // Compute anomaly threshold
  res.json({ success: true, processedAt: Date.now() });
});

export default router;`,
            },
          ],
        },
        {
          name: 'models',
          type: 'folder',
          children: [
            {
              name: 'Project.ts',
              type: 'file',
              code: `import { Schema, model } from 'mongoose';

const ProjectSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  progress: { type: Number, default: 0 },
}, { timestamps: true });

export default model('Project', ProjectSchema);`,
            },
          ],
        },
      ],
    },
    {
      name: 'package.json',
      type: 'file',
      code: `{\n  "name": "projectforge-service",\n  "version": "1.0.0",\n  "dependencies": {\n    "express": "^4.19.2",\n    "mongoose": "^8.3.0",\n    "ws": "^8.16.0"\n  }\n}`,
    },
  ];

  const handleSelectFile = (file: FileNode) => {
    if (file.code) {
      setSelectedFile(file.name);
      setActiveCode(file.code);
    }
  };

  const handleCopyCode = () => {
    Alert.alert('Copied', `${selectedFile} copied to clipboard.`);
  };

  const renderTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node) => (
      <View key={node.name} style={{ marginLeft: level * 16 }}>
        {node.type === 'folder' ? (
          <View style={styles.folderRow}>
            <FolderOpen size={16} color={colors.secondaryLight} />
            <Text style={styles.folderName}>{node.name}</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.fileRow,
              selectedFile === node.name && styles.fileRowSelected,
            ]}
            onPress={() => handleSelectFile(node)}
          >
            <FileCode size={16} color={colors.primaryLight} />
            <Text
              style={[
                styles.fileName,
                selectedFile === node.name && styles.fileNameSelected,
              ]}
            >
              {node.name}
            </Text>
          </TouchableOpacity>
        )}
        {node.children && renderTree(node.children, level + 1)}
      </View>
    ));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Module 10: Starter Code"
        subtitle="Directory tree & reference boilerplates"
        showBack
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        {/* Directory Explorer */}
        <Card title="Project Directory Tree" subtitle="Tap any file to inspect reference code">
          <View style={styles.treeContainer}>{renderTree(fileTree)}</View>
        </Card>

        {/* Code Viewer */}
        <Card
          title={selectedFile}
          headerRight={
            <TouchableOpacity onPress={handleCopyCode} style={styles.copyBtn}>
              <Copy size={16} color={colors.primaryLight} />
              <Text style={styles.copyBtnText}>Copy</Text>
            </TouchableOpacity>
          }
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.codeBlock}>
              <Text style={styles.codeContent}>{activeCode}</Text>
            </View>
          </ScrollView>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  treeContainer: {
    paddingVertical: spacing.xs,
  },
  folderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  folderName: {
    ...typography.captionBold,
    color: colors.text,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  fileRowSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  fileName: {
    ...typography.caption,
    color: colors.textMuted,
  },
  fileNameSelected: {
    color: colors.primaryLight,
    fontWeight: '700',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  copyBtnText: {
    ...typography.captionBold,
    color: colors.primaryLight,
  },
  codeBlock: {
    backgroundColor: '#090d16',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minWidth: 320,
  },
  codeContent: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: colors.secondaryLight,
    fontSize: 12,
    lineHeight: 18,
  },
});
