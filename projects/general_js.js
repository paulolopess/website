

// ----------------- ESCOLHE O PROJECTO --------------------------------------------------------------------------------------------------
let globalProjectData = null;

function getModelFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('project') || 'default_project_folder';
}




// ----------------- CARREGAR O JSON E AS PROPRIEDADES DE CADA MODELO --------------------------------------------------------------------------------------------------
async function loadProjectData() {
    try {
        const projectFolder = getModelFromURL();
        console.log('Selected project folder:', projectFolder);

        if (!projectFolder || projectFolder === 'default_project_folder') {
            console.warn('No specific project selected in URL, loading default or handling accordingly.');
        }

        const response = await fetch(`./${projectFolder}/data.json`);
        console.log('Fetch response:', response);

        if (!response.ok) {
            throw new Error(`Failed to load JSON: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('JSON data loaded:', data);
        globalProjectData = data; // Store data globally for other functions to access

        const modelViewer = document.getElementById('model-viewer');
        if (!modelViewer) {
            console.error('Error: model-viewer element not found!');
            return null;
        }

        // Assign attributes to model-viewer
        if (data.modelSrc) modelViewer.setAttribute('src', `./${projectFolder}/${data.modelSrc}`);
        if (data.environmentImage) modelViewer.setAttribute('environment-image', `./${projectFolder}/${data.environmentImage}`);
        if (data.cameraOrbit) modelViewer.setAttribute('camera-orbit', data.cameraOrbit);
        if (data['min-camera-orbit']) modelViewer.setAttribute('min-camera-orbit', data['min-camera-orbit']);
        if (data['max-camera-orbit']) modelViewer.setAttribute('max-camera-orbit', data['max-camera-orbit']);
        if (data['min-field-of-view']) modelViewer.setAttribute('min-field-of-view', data['min-field-of-view']);
        if (data['max-field-of-view']) modelViewer.setAttribute('max-field-of-view', data['max-field-of-view']);
        if (data['disable-zoom'] !== undefined) modelViewer.disableZoom = data['disable-zoom'];
        if (data['disable-pan'] !== undefined) modelViewer.disablePan = data['disable-pan'];
        if (!modelViewer.hasAttribute('camera-controls')) modelViewer.setAttribute('camera-controls', '');

        // Update project texts
        document.getElementById('model-title').textContent = data.title || 'Untitled Model';

        const backgroundOverlay = document.querySelector('.background-overlay');
        const bottomColor = "rgb(230, 230, 230)";
        const whiteColor = "rgb(255, 255, 255)";
        if (data.backgroundTopColor && backgroundOverlay) {
            backgroundOverlay.style.background = `linear-gradient(to bottom, ${data.backgroundTopColor} 0%, ${bottomColor})`;
        } else if (backgroundOverlay) {
            backgroundOverlay.style.background = `linear-gradient(to bottom, ${whiteColor} 0%, ${whiteColor} 100%)`;
        }

        document.getElementById('project-name').innerHTML = data.name ? data.name.replace(/\n/g, '<br>') : 'Project Name';
        document.getElementById('project-designer').textContent = data.designer || '';
        document.getElementById('project-location').textContent = data.location || '';
        document.getElementById('project-description').innerHTML = data.description || '';

        // Load gallery images
        const galleryItemsContainer = document.querySelector('.gallery-items');
        if (galleryItemsContainer) {
            galleryItemsContainer.innerHTML = '';
            if (data.galleryImages && Array.isArray(data.galleryImages)) {
                data.galleryImages.forEach((imgFilename, index) => {
                    const div = document.createElement('div');
                    div.className = 'gallery-item';
                    const img = document.createElement('img');
                    // Paths for gallery images are relative to project folder
                    img.src = `./${projectFolder}/IMG/${imgFilename}`;
                    img.alt = `Image ${index + 1}`;
                    div.appendChild(img);
                    galleryItemsContainer.appendChild(div);
                });
            }
        }

        // Remove old hotspots before adding new ones
        const oldHotspots = modelViewer.querySelectorAll('[slot^="hotspot-"]');
        oldHotspots.forEach(h => h.remove());

        // Add hotspots based on JSON data
        if (data.hotspots && Array.isArray(data.hotspots)) {
            data.hotspots.forEach(hotspot => {
                const hotspotElement = document.createElement('button');
                hotspotElement.className = 'hotspot';
                hotspotElement.slot = 'hotspot-' + hotspot.id;
                hotspotElement.setAttribute('data-position', hotspot.position);
                if (hotspot.normal) {
                    hotspotElement.setAttribute('data-normal', hotspot.normal);
                }
                hotspotElement.title = hotspot.text || '';

                if (hotspot.action) {
                    hotspotElement.setAttribute('data-action', hotspot.action);
                }
                // <--- NEW: Store material group for "ChangeMaterials" action
                if (hotspot.materialGroup) {
                    hotspotElement.setAttribute('data-material-group', hotspot.materialGroup);
                }
                // <--- NEW: Store initialName for direct use in hotspot action
                if (hotspot.initialName) {
                    hotspotElement.setAttribute('data-initial-name', hotspot.initialName);
                }
                // <--- NEW: Store URL for openUrl action
                if (hotspot.url) {
                    hotspotElement.setAttribute('data-url', hotspot.url);
                }

                if (hotspot.image) {
                    const img = document.createElement('img');
                    img.src = `./projects/${hotspot.image.replace('../', '')}`;
                    console.log(`Hotspot icon src set to: ${img.src}`);
                    img.alt = hotspot.text || '';
                    img.classList.add('hotspot-icon');
                    hotspotElement.appendChild(img);
                } else {
                    hotspotElement.textContent = '●';
                }

                modelViewer.appendChild(hotspotElement);
            });
        }

        // --- NEW SECTION: Dynamically Generate Material Change Buttons ---
        const materialChangeContainer = document.getElementById('material-change-container');
        if (materialChangeContainer && data.materials) {
            // Remove any old dynamically generated texture groups
            const existingTextureGroups = materialChangeContainer.querySelectorAll('.texture-group');
            existingTextureGroups.forEach(group => group.remove());

            for (const groupKey in data.materials) {
                if (data.materials.hasOwnProperty(groupKey)) {
                    const materialGroupData = data.materials[groupKey];

                    const textureGroupDiv = document.createElement('div');
                    textureGroupDiv.className = 'texture-group';
                    textureGroupDiv.id = `${groupKey}-textures`; 

                    materialGroupData.textures.forEach(texture => {
                        const button = document.createElement('button');
                        button.className = 'change-texture';
                        button.setAttribute('data-material', materialGroupData.materialIndex);
                        button.setAttribute('data-texture', `./${projectFolder}/${texture.textureFile}`);
                        button.setAttribute('data-material-name', texture.name);

                        const img = document.createElement('img');
                        // Texture thumbnail paths are relative to project folder
                        img.src = `./${projectFolder}/${texture.thumbnail}`;
                        img.className = 'texture-preview';
                        img.alt = texture.name;

                        button.appendChild(img);
                        textureGroupDiv.appendChild(button);
                    });
                    materialChangeContainer.appendChild(textureGroupDiv);
                }
            }
        }
        return modelViewer;
    } catch (error) {
        console.error('Error loading project:', error);
        return null;
    }
}



//-----------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    const modelViewer = await loadProjectData();

    if (!modelViewer) {
        console.error("ModelViewer não disponível. Algumas funcionalidades podem não funcionar.");
        return;
    }

    // --- FUNÇÃO: toggleMaterialAlpha --- (No changes needed here)
    function toggleMaterialAlpha(hotspotData, projectData) {
        const targetMaterialName = hotspotData.targetMaterial;
        const alphaOn = hotspotData.alphaValueOn;
        const alphaOff = hotspotData.alphaValueOff;

        if (!projectData || !projectData.materials || !projectData.materials[targetMaterialName]) {
            console.error(`Erro: Dados do material '${targetMaterialName}' não encontrados.`);
            return;
        }

        const materialConfig = projectData.materials[targetMaterialName];
        const materialIndex = materialConfig.materialIndex;

        if (!modelViewer.model || !modelViewer.model.materials || !modelViewer.model.materials[materialIndex]) {
            console.error(`ERRO: Modelo ou material no índice ${materialIndex} não encontrado.`);
            return;
        }

        const actual3DMaterial = modelViewer.model.materials[materialIndex];
        const currentOpacity = actual3DMaterial.opacity;

        if (Math.abs(currentOpacity - alphaOn) < 0.001) {
            actual3DMaterial.opacity = alphaOff;
            actual3DMaterial.transparent = (alphaOff < 1.0);
            console.log(`Material '${targetMaterialName}' -> opacidade OFF (${alphaOff})`);
        } else {
            actual3DMaterial.opacity = alphaOn;
            actual3DMaterial.transparent = true;
            console.log(`Material '${targetMaterialName}' -> opacidade ON (${alphaOn})`);
        }
    }

    // --- BOTÃO DE ALTERNÂNCIA DE HOTSPOTS --- (Adjusted to remove dimension toggle)
    const toggleButton = document.getElementById('toggle-hotspots-button');
    if (toggleButton) {
        modelViewer.classList.remove('hotspots-visible'); // Estado inicial
        toggleButton.addEventListener('click', () => {
            modelViewer.classList.toggle('hotspots-visible');
            // No longer calling toggleDimensionsVisibility here
        });
    }

    // --- ELEMENTOS E VARIÁVEIS PARA TROCA DE MATERIAL --- (No changes needed here)
    const materialContainer = document.getElementById("material-change-container");
    const materialName = document.getElementById('material-name');
    let selectedMaterialName = '';
    let lastSelectedMaterialWood = '';
    let lastSelectedMaterialLeather = '';

    if (materialContainer) {
        materialContainer.style.opacity = "0";
        materialContainer.style.visibility = "hidden";
        materialContainer.style.transform = "translateY(20px)";
        materialContainer.style.display = "flex";
    }

    function showMaterialGroup(groupElement, titleText, initialMaterialName, lastSelectedMaterial) {
        if (!materialContainer || !groupElement) return;

        materialContainer.querySelectorAll('.texture-group').forEach(group => group.style.display = "none");
        groupElement.style.display = "flex";

        const lastSelectedButton = groupElement.querySelector(`.change-texture[data-material-name='${lastSelectedMaterial}']`);
        const allButtons = groupElement.querySelectorAll('.change-texture');
        allButtons.forEach(btn => btn.classList.remove('selected'));
        
        if (lastSelectedButton) {
            selectedMaterialName = lastSelectedMaterial;
            lastSelectedButton.classList.add('selected');
        } else {
            const firstButton = groupElement.querySelector('.change-texture');
            if (firstButton) {
                selectedMaterialName = firstButton.getAttribute('data-material-name');
                firstButton.classList.add('selected');
            }
        }
        if (materialName) materialName.textContent = selectedMaterialName;

        materialContainer.style.opacity = "1";
        materialContainer.style.transform = "translateY(0)";
        materialContainer.style.visibility = "visible";
    }

    function hideMaterialContainer() {
        if (!materialContainer) return;
        materialContainer.style.opacity = "0";
        materialContainer.style.transform = "translateY(20px)";
        setTimeout(() => {
            materialContainer.style.visibility = "hidden";
        }, 300);
    }

    document.addEventListener("click", (event) => {
        if (materialContainer && !materialContainer.contains(event.target) && !event.target.closest('.hotspot')) {
            hideMaterialContainer();
        }
    });

    materialContainer?.addEventListener("click", (event) => {
        event.stopPropagation();
    });


        // Initialize materials
        if (window.globalProjectData && window.globalProjectData.materials) {
            for (const key in window.globalProjectData.materials) {
                const materialConfig = window.globalProjectData.materials[key];
                if (materialConfig.textures && materialConfig.textures.length > 0) {
                    const materialIndex = materialConfig.materialIndex;
                    const initialAlpha = materialConfig.textures[0].initialAlpha;

                    if (modelViewer.model && modelViewer.model.materials[materialIndex]) {
                        const material = modelViewer.model.materials[materialIndex];
                        material.opacity = initialAlpha;
                        material.transparent = (initialAlpha < 1.0);
                    }
                }
            }
        }








  // ----------------- MANIPULA O QUE OS HOTSPOTS FAZEM --------------------------------------------------------------------------------------------------
  modelViewer.addEventListener('click', (event) => {
      const clickedElement = event.target;
      const hotspotElement = clickedElement.closest('.hotspot');

      if (hotspotElement) {
          event.stopPropagation(); // Stop propagation for handled hotspots

          const hotspotId = hotspotElement.dataset.id; // Assuming you have data-id on your hotspot buttons
          const actionType = hotspotElement.dataset.action; // Get the action from data-action attribute
          const url = hotspotElement.dataset.url; // Get URL if action is 'OpenURL'

          switch (actionType) {
              case 'ChangeMaterials':
                  const materialGroupKey = hotspotElement.dataset.materialGroup;
                  const materialData = globalProjectData.materials[materialGroupKey]; // Assumindo globalProjectData existe

                  if (materialData) {
                      const currentMaterialGroupElement = document.getElementById(`${materialGroupKey}-textures`);
                      showMaterialGroup(
                          currentMaterialGroupElement,
                          materialData.groupTitle,
                          materialData.initialName,
                          materialGroupKey === 'wood' ? lastSelectedMaterialWood : lastSelectedMaterialLeather
                      );
                  } else {
                      console.warn(`Material group data not found for key: ${materialGroupKey}`);
                  }

          } 
      }
  });



  // ----------------- ALTRERA MATERIAIS USANDO HOTSPOT --------------------------------------------------------------------------------------------------
  materialContainer.addEventListener('click', async (event) => {
      const button = event.target.closest('.change-texture');
      if (button && modelViewer.model) { // Ensure model exists before attempting material changes
          const materialIndex = parseInt(button.getAttribute("data-material")); // Parse as integer
          const newTextureURL = button.getAttribute("data-texture");
          const buttonMaterialName = button.getAttribute("data-material-name");

          // Only change if a different material is selected
          if (selectedMaterialName !== buttonMaterialName) {
              try {
                  const material = modelViewer.model.materials[materialIndex];
                  if (!material) {
                      console.error(`Material at index ${materialIndex} not found in model.`);
                      return;
                  }

                  const texture = await modelViewer.createTexture(newTextureURL);
                  material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);

                  selectedMaterialName = buttonMaterialName;
                  if (materialName) materialName.style.opacity = 0;
                  setTimeout(() => {
                      if (materialName) materialName.textContent = selectedMaterialName;
                      if (materialName) materialName.style.opacity = 1;
                  }, 150);

                  // Determine which last selected variable to update
                  const parentGroup = button.closest('.texture-group');
                  if (parentGroup) {
                      if (parentGroup.id === 'wood-textures') {
                          lastSelectedMaterialWood = buttonMaterialName;
                      } else if (parentGroup.id === 'leather-textures') {
                          lastSelectedMaterialLeather = buttonMaterialName;
                      }
                  }

                  // Remove 'selected' from all buttons in the current group and add to clicked one
                  if (parentGroup) {
                      parentGroup.querySelectorAll('.change-texture').forEach(btn => btn.classList.remove('selected'));
                  }
                  button.classList.add('selected');

              } catch (error) {
                  console.error('Error changing texture:', error);
              }
          }
      }
  });
});



// ----------------- ESCONDE/MOSTRA AO CLICAR NA SETA --------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const arrow = document.querySelector('.arrow');
  const bottomLeftContainer = document.querySelector('.bottom-left-container');
  const gallery = document.querySelector('.gallery');
  const title = document.querySelector('.title');
  const overlay = document.querySelector('.background-overlay');

  let isGalleryOpen = false;
  let isBottomLeftOpen = false;

  if (gallery && bottomLeftContainer && title) {
    gallery.style.display = 'none';
    bottomLeftContainer.style.bottom = '-100%';
    bottomLeftContainer.style.display = 'none';
    title.style.animation = 'fadeInBottom 1s ease-out forwards';
  }

  let isBackgroundUp = false;

  if (arrow) {
    arrow.addEventListener('click', () => {
      const isHidden = bottomLeftContainer.style.bottom === '-100%' || bottomLeftContainer.style.bottom === '';

      // Toggle gallery display
      gallery.style.display = isHidden ? 'block' : 'none';
      title.classList.toggle('move-left');
      arrow.classList.toggle('active');

      if (overlay) {
        overlay.classList.toggle('up', !isBackgroundUp);
        isBackgroundUp = !isBackgroundUp;
      }

      // Toggle bottomLeftContainer
      if (isBottomLeftOpen) {
        bottomLeftContainer.classList.add('closed');
        setTimeout(() => {
          bottomLeftContainer.style.display = 'none';
        }, 500);
      } else {
        bottomLeftContainer.classList.remove('closed');
        bottomLeftContainer.style.display = 'block';
      }
      isBottomLeftOpen = !isBottomLeftOpen;

      // Toggle gallery animation
      if (isGalleryOpen) {
        gallery.classList.add('closed');
      } else {
        gallery.classList.remove('closed');
      }
      isGalleryOpen = !isGalleryOpen;
    });
  }
});



// ----------------- MODAL GALERIA --------------------------------------------------------------------------------------------------
  const galleryContainer = document.querySelector('.gallery-items');
  const modal = document.querySelector('.modal');
  const modalImg = document.getElementById('img01');
  const modalVideo = document.getElementById('video01');
  const videoSource = document.getElementById('videoSource');
  const closeBtn = document.querySelector('.close');
  const prevArrow = document.querySelector('.modal .arrow.left');
  const nextArrow = document.querySelector('.modal .arrow.right');

  let currentIndex = 0;
  let galleryItems = [];

  function updateGalleryItems() {
    galleryItems = Array.from(galleryContainer.querySelectorAll('img, video'));
  }

  function openModal(index) {
    if (!modal) return;
    if (!galleryItems.length) updateGalleryItems();

    modal.style.display = 'flex';
    const item = galleryItems[index];

    if (item.tagName === 'IMG') {
      modalImg.src = item.src;
      modalImg.style.display = 'block';
      modalVideo.style.display = 'none';
    } else if (item.tagName === 'VIDEO') {
      const source = item.querySelector('source');
      if (source) {
        videoSource.src = source.src;
        modalVideo.load();
        modalVideo.style.display = 'block';
        modalImg.style.display = 'none';
        modalVideo.play();
      }
    }

    currentIndex = index;
    document.body.classList.add('blur-background');
  }

  function closeModal() {
    modal.style.display = 'none';
    modalVideo.pause();
    modalVideo.currentTime = 0;
    document.body.classList.remove('blur-background');
  }

  function navigate(step) {
    currentIndex = (currentIndex + step + galleryItems.length) % galleryItems.length;
    openModal(currentIndex);
  }

  galleryContainer?.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
      updateGalleryItems();
      const index = galleryItems.indexOf(target);
      if (index !== -1) openModal(index);
    }
  });

  closeBtn?.addEventListener('click', closeModal);

  window.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  prevArrow?.addEventListener('click', () => navigate(-1));
  nextArrow?.addEventListener('click', () => navigate(1));
  modalImg?.addEventListener('click', () => navigate(1));

updateGalleryItems();



// ----------------- MOSTRAR / ESCONDER QR CODE --------------------------------------------------------------------------------------------------
let isQRCodeVisible = false;

function generateQRCode() {
  const qrCodeUrl = "https://paulolopess.github.io/website/projects/modelsqrcode/modelqrcode-viewer.html";
  const qrCodeContainer = document.getElementById("qr-code");
  const container = document.getElementById("qr-code-container");
  const logo = document.getElementById("ar-logo");

  if (!isQRCodeVisible) {
    if (!qrCodeContainer.hasChildNodes()) {
      new QRCode(qrCodeContainer, {
        text: qrCodeUrl,
        width: 128,
        height: 128
      });
    }

    container.style.display = "block";
    setTimeout(() => {
      container.classList.add("visible");
    }, 10);
    logo.classList.add("fade-out");

    // Usa um timeout para permitir o clique no botão sem acionar o fechamento
    setTimeout(() => {
      document.addEventListener("click", handleOutsideClick);
    }, 20);

    isQRCodeVisible = true;
  } else {
    closeQRCode();
  }
}

function closeQRCode() {
  const container = document.getElementById("qr-code-container");
  const logo = document.getElementById("ar-logo");

  container.classList.remove("visible");
  setTimeout(() => {
    container.style.display = "none";
  }, 300);
  setTimeout(() => {
    logo.classList.remove("fade-out");
  }, 300);

  document.removeEventListener("click", handleOutsideClick);
  isQRCodeVisible = false;
}

function handleOutsideClick(event) {
  const container = document.getElementById("qr-code-container");
  const qrButton = document.getElementById("qr-code-button");

  if (
    container &&
    !container.contains(event.target) &&
    event.target !== qrButton
  ) {
    closeQRCode();
  }
}

function setupQRCodeToggle() {
  const qrButton = document.getElementById("qr-code-button");
  if (qrButton) {
    qrButton.addEventListener("click", (event) => {
      event.stopPropagation(); // Impede que o clique no botão feche imediatamente o QR
      generateQRCode();
    });
  }
}













// --------------------- MEDIDAS ------------------------------------------------------------------------------
document.querySelector('#model-viewer').addEventListener('load', () => {

  const modelViewer = document.querySelector('#model-viewer');
  const toggleButton = document.querySelector('.Hotspot[slot="hotspot-medidas"]');
  
  // Seleciona os botões de hotspots dentro do shadow DOM do modelViewer
  const dimElements = [
    ...modelViewer.shadowRoot.querySelectorAll('button[slot^="hotspot-dim"]'),
    modelViewer.shadowRoot.querySelector('#dimLines')
  ];
  
  let dimensionsVisible = false;

  function drawLine(svgLine, dotHotspot1, dotHotspot2, dimensionHotspot) {
    if (dotHotspot1 && dotHotspot2) {
      svgLine.setAttribute('x1', dotHotspot1.canvasPosition.x);
      svgLine.setAttribute('y1', dotHotspot1.canvasPosition.y);
      svgLine.setAttribute('x2', dotHotspot2.canvasPosition.x);
      svgLine.setAttribute('y2', dotHotspot2.canvasPosition.y);

      if (dimensionHotspot && !dimensionHotspot.facingCamera) {
        svgLine.classList.add('hide');
      } else {
        svgLine.classList.remove('hide');
      }
    }
  }

  const dimLines = modelViewer.shadowRoot.querySelectorAll('line');

  // Substitui o modelViewer.queryHotspot por querySelector no shadowRoot
  const getHotspot = (name) => modelViewer.shadowRoot.querySelector(`button[slot="${name}"]`);

  const renderSVG = () => {
    drawLine(dimLines[0], getHotspot('hotspot-dot+X-Y+Z'), getHotspot('hotspot-dot+X-Y-Z'), getHotspot('hotspot-dim+X-Y'));
    drawLine(dimLines[1], getHotspot('hotspot-dot+X-Y-Z'), getHotspot('hotspot-dot+X+Y-Z'), getHotspot('hotspot-dim+X-Z'));
    drawLine(dimLines[2], getHotspot('hotspot-dot+X+Y-Z'), getHotspot('hotspot-dot-X+Y-Z'));
    drawLine(dimLines[3], getHotspot('hotspot-dot-X+Y-Z'), getHotspot('hotspot-dot-X-Y-Z'), getHotspot('hotspot-dim-X-Z'));
    drawLine(dimLines[4], getHotspot('hotspot-dot-X-Y-Z'), getHotspot('hotspot-dot-X-Y+Z'), getHotspot('hotspot-dim-X-Y'));
  };

  const center = modelViewer.getBoundingBoxCenter();
  const size = modelViewer.getDimensions();
  const x2 = size.x / 2;
  const y2 = size.y / 2;
  const z2 = size.z / 2;

  modelViewer.updateHotspot({
    name: 'hotspot-dot+X-Y+Z',
    position: `${center.x + x2} ${center.y - y2} ${center.z + z2}`
  });

  modelViewer.updateHotspot({
    name: 'hotspot-dim+X-Y',
    position: `${center.x + x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
  });
  getHotspot('hotspot-dim+X-Y').textContent = `${(size.z * 100).toFixed(0)} cm`;

  modelViewer.updateHotspot({
    name: 'hotspot-dot+X-Y-Z',
    position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`
  });

  modelViewer.updateHotspot({
    name: 'hotspot-dim+X-Z',
    position: `${center.x + x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
  });
  getHotspot('hotspot-dim+X-Z').textContent = `${(size.y * 100).toFixed(0)} cm`;

  modelViewer.updateHotspot({
    name: 'hotspot-dot+X+Y-Z',
    position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`
  });

  modelViewer.updateHotspot({
    name: 'hotspot-dim+Y-Z',
    position: `${center.x} ${center.y + y2 * 1.1} ${center.z - z2 * 1.1}`
  });
  getHotspot('hotspot-dim+Y-Z').textContent = `${(size.x * 100).toFixed(0)} cm`;

  modelViewer.updateHotspot({
    name: 'hotspot-dot-X+Y-Z',
    position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`
  });

  modelViewer.updateHotspot({
    name: 'hotspot-dim-X-Z',
    position: `${center.x - x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
  });
  getHotspot('hotspot-dim-X-Z').textContent = `${(size.y * 100).toFixed(0)} cm`;

  modelViewer.updateHotspot({
    name: 'hotspot-dot-X-Y-Z',
    position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`
  });

  modelViewer.updateHotspot({
    name: 'hotspot-dim-X-Y',
    position: `${center.x - x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
  });
  getHotspot('hotspot-dim-X-Y').textContent = `${(size.z * 100).toFixed(0)} cm`;

  modelViewer.updateHotspot({
    name: 'hotspot-dot-X-Y+Z',
    position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`
  });

  renderSVG();

  modelViewer.addEventListener('camera-change', renderSVG);

  function toggleDimensionsVisibility() {
    dimensionsVisible = !dimensionsVisible;
    dimElements.forEach((element) => {
      if (dimensionsVisible) {
        element.classList.remove('hide');
      } else {
        element.classList.add('hide');
      }
    });

    if (dimensionsVisible) {
      modelViewer.cameraOrbit = "50deg 80deg 50m";
    }
  }

  toggleButton.addEventListener('click', toggleDimensionsVisibility);

  // Começa com as medidas escondidas
  dimElements.forEach((element) => {
    element.classList.add('hide');
  });

  // Toggle visual 'selected' button class
  const toggleDimensionsButton = document.querySelector('.toggle-dimensions-button');
  if (toggleDimensionsButton) {
    toggleDimensionsButton.addEventListener('click', () => {
      toggleDimensionsButton.classList.toggle('selected');
    });
  }
});