import React, { useState } from 'react';
import { Header, TabType } from './components/common/Header';
import { WorkflowBar } from './components/common/WorkflowBar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ReconstructionView } from './components/reconstruction/ReconstructionView';
import { ValidationView } from './components/validation/ValidationView';
import { DiagnosisView } from './components/diagnosis/DiagnosisView';
import { SimulationView } from './components/simulation/SimulationView';
import { PlanningView } from './components/planning/PlanningView';
import { SegmentDetailDrawer } from './components/common/SegmentDetailDrawer';
import { QuickGuideModal } from './components/common/QuickGuideModal';
import { knownDrainageSegments, drainageNodes } from './data/drainageNetwork';
import { reconstructedDrainageSegments } from './data/reconstructedNetwork';
import { floodAccumulationZones } from './data/floodZones';
import { DrainageSegment, DrainageNode } from './data/types';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedSegment, setSelectedSegment] = useState<DrainageSegment | null>(null);
  const [selectedNode, setSelectedNode] = useState<DrainageNode | null>(null);
  const [reconstructionGenerated, setReconstructionGenerated] = useState<boolean>(true);
  const [simulationRun, setSimulationRun] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  const handleSelectSegment = (segment: DrainageSegment) => {
    setSelectedSegment(segment);
    setSelectedNode(null);
  };

  const handleSelectNode = (node: DrainageNode) => {
    setSelectedNode(node);
    setSelectedSegment(null);
  };

  const handleCloseInspector = () => {
    setSelectedSegment(null);
    setSelectedNode(null);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 text-slate-800">
      {/* 1. Global Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickGuide={() => setIsGuideOpen(true)}
      />

      {/* 2. Interactive Workflow Pipeline Bar */}
      <WorkflowBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reconstructionGenerated={reconstructionGenerated}
        simulationRun={simulationRun}
      />

      {/* 3. Active Module Content View */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'dashboard' && (
          <DashboardView
            knownSegments={knownDrainageSegments}
            reconstructedSegments={reconstructedDrainageSegments}
            nodes={drainageNodes}
            floodZones={floodAccumulationZones}
            selectedSegment={selectedSegment}
            selectedNode={selectedNode}
            onSelectSegment={handleSelectSegment}
            onSelectNode={handleSelectNode}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'reconstruction' && (
          <ReconstructionView
            knownSegments={knownDrainageSegments}
            reconstructedSegments={reconstructedDrainageSegments}
            nodes={drainageNodes}
            floodZones={floodAccumulationZones}
            selectedSegment={selectedSegment}
            selectedNode={selectedNode}
            onSelectSegment={handleSelectSegment}
            onSelectNode={handleSelectNode}
            reconstructionGenerated={reconstructionGenerated}
            setReconstructionGenerated={setReconstructionGenerated}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'validation' && (
          <ValidationView
            knownSegments={knownDrainageSegments}
            reconstructedSegments={reconstructedDrainageSegments}
            nodes={drainageNodes}
            floodZones={floodAccumulationZones}
            selectedSegment={selectedSegment}
            selectedNode={selectedNode}
            onSelectSegment={handleSelectSegment}
            onSelectNode={handleSelectNode}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'diagnosis' && (
          <DiagnosisView
            knownSegments={knownDrainageSegments}
            reconstructedSegments={reconstructedDrainageSegments}
            nodes={drainageNodes}
            floodZones={floodAccumulationZones}
            selectedSegment={selectedSegment}
            selectedNode={selectedNode}
            onSelectSegment={handleSelectSegment}
            onSelectNode={handleSelectNode}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'simulation' && (
          <SimulationView
            knownSegments={knownDrainageSegments}
            reconstructedSegments={reconstructedDrainageSegments}
            nodes={drainageNodes}
            floodZones={floodAccumulationZones}
            selectedSegment={selectedSegment}
            selectedNode={selectedNode}
            onSelectSegment={handleSelectSegment}
            onSelectNode={handleSelectNode}
            simulationRun={simulationRun}
            setSimulationRun={setSimulationRun}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'planning' && (
          <PlanningView
            knownSegments={knownDrainageSegments}
            reconstructedSegments={reconstructedDrainageSegments}
            nodes={drainageNodes}
            floodZones={floodAccumulationZones}
            selectedSegment={selectedSegment}
            selectedNode={selectedNode}
            onSelectSegment={handleSelectSegment}
            onSelectNode={handleSelectNode}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Slide-in Segment / Node Asset Inspector Drawer */}
      <SegmentDetailDrawer
        selectedSegment={selectedSegment}
        selectedNode={selectedNode}
        onClose={handleCloseInspector}
      />

      {/* 2-Minute Demo Presentation Guide Modal */}
      <QuickGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onJumpToStep={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}

export default App;
